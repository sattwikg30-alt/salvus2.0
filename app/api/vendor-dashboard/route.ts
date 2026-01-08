import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Vendor from '@/models/Vendor'
import Transaction from '@/models/Transaction'
import Campaign from '@/models/Campaign'
import InventoryItem from '@/models/InventoryItem'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

async function getUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  if (!token) return null
  try {
    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET || 'fallback_secret')
    return decoded
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const vendor = await Vendor.findOne({ email: user.email }).populate('campaignId', 'name stateRegion location')
    if (!vendor) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    const txns = await Transaction.find({ vendorId: vendor._id })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('campaignId', 'name')

    const paymentsReceived = txns
      .filter(t => t.status === 'Completed' || t.status === 'Paid')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const itemsCount = await InventoryItem.countDocuments({ vendorId: vendor._id })

    const response = {
      vendor: {
        id: vendor.storeId || String(vendor._id),
        storeName: vendor.name || '',
        contactPerson: vendor.contactPerson || '',
        vendorType: vendor.category || '',
        state: (vendor.campaignId as any)?.stateRegion || (vendor.campaignId as any)?.location || '',
        district: vendor.district || '',
        area: vendor.area || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        allowedCategories: Array.isArray(vendor.authorizedCategories) ? vendor.authorizedCategories : [],
      },
      stats: {
        itemsListed: itemsCount,
        totalOrders: txns.length,
        paymentsReceived,
      },
      transactions: txns.map(t => ({
        id: String(t._id),
        campaign: (t.campaignId as any)?.name || 'Unknown',
        amount: t.amount || 0,
        date: new Date(t.timestamp).toLocaleString(),
        status: t.status,
        category: t.category,
      })),
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    const message = error.message || 'Internal Server Error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
