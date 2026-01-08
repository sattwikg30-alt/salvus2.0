import React from 'react';
import { MapPin, Mail, Phone, User, Store, Tag } from 'lucide-react';

interface VendorProfileProps {
  vendor: {
    id: string;
    storeName: string;
    contactPerson: string;
    vendorType: string;
    state: string;
    district: string;
    area: string;
    phone: string;
    email: string;
    allowedCategories: string[];
  };
}

const VendorProfile: React.FC<VendorProfileProps> = ({ vendor }) => {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 h-full relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center shadow-lg">
            <Store className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">{vendor.storeName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] bg-accent/10 border border-accent/20 text-accent font-medium tracking-wide uppercase">
                {vendor.vendorType}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <User className="w-3 h-3" /> Contact Details
            </h3>

            <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <User className="w-5 h-5 text-gray-400 mt-0.5 group-hover:text-accent transition-colors" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Authorized Contact</p>
                <p className="text-sm font-medium text-gray-200">{vendor.contactPerson}</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5 group-hover:text-accent transition-colors" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                <p className="text-sm font-medium text-gray-200 font-mono">{vendor.phone}</p>
              </div>
            </div>

            <div className="group flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 group-hover:text-accent transition-colors" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-200 truncate max-w-[200px]">{vendor.email}</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Location
            </h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-200">{vendor.area}</p>
                  <p className="text-xs text-gray-400">{vendor.district}, {vendor.state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Tag className="w-3 h-3" /> Approved Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {vendor.allowedCategories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1.5 rounded-lg bg-dark-darker border border-white/10 text-xs font-medium text-gray-300 hover:border-accent/40 hover:text-white transition-all cursor-default"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
