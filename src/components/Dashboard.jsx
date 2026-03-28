import React from 'react';
import { Users, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';

const DashboardStats = () => {
  return (
    <div className="space-y-12 py-8 font-inter">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-jakarta font-bold text-sh-neutral-800">Welcome to SchoolHub</h1>
        <p className="text-base md:text-lg text-sh-neutral-500 max-w-2xl mx-auto leading-relaxed">
          Your comprehensive school management dashboard with attendance, finance, and staff insights.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <div className="bg-white rounded-3xl p-8 border border-sh-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sh-primary-light rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
          <div className="w-14 h-14 bg-sh-primary-light rounded-2xl flex items-center justify-center mb-8 relative">
            <DollarSign className="w-8 h-8 text-sh-primary" />
          </div>
          <p className="text-[10px] text-sh-neutral-400 font-bold uppercase tracking-widest mb-2 relative">Current Balance</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-sh-neutral-800 relative">₹78,400</h2>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-sh-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sh-success-light rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
          <div className="w-14 h-14 bg-sh-success-light rounded-2xl flex items-center justify-center mb-8 relative">
            <TrendingUp className="w-8 h-8 text-sh-success" />
          </div>
          <p className="text-[10px] text-sh-neutral-400 font-bold uppercase tracking-widest mb-2 relative">Total Fees</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-sh-neutral-800 relative">₹1,20,600</h2>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-sh-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sh-secondary-light rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
          <div className="w-14 h-14 bg-sh-secondary-light rounded-2xl flex items-center justify-center mb-8 relative">
            <Users className="w-8 h-8 text-sh-secondary" />
          </div>
          <p className="text-[10px] text-sh-neutral-400 font-bold uppercase tracking-widest mb-2 relative">Total Staff</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-sh-neutral-800 relative">42</h2>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-sh-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sh-accent-light rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
          <div className="w-14 h-14 bg-sh-accent-light rounded-2xl flex items-center justify-center mb-8 relative">
            <GraduationCap className="w-8 h-8 text-sh-accent" />
          </div>
          <p className="text-[10px] text-sh-neutral-400 font-bold uppercase tracking-widest mb-2 relative">Classes Active</p>
          <h2 className="text-3xl md:text-4xl font-jakarta font-bold text-sh-neutral-800 relative">10</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;