import React, { useState } from 'react';

const sections = {
  dashboard: {
    title: 'Dashboard',
    description: 'Overview statistics and quick metrics.',
    items: [
      { label: 'Balance', value: '₹42,000' },
      { label: 'Collected', value: '₹1,20,000' },
      { label: 'Users', value: '24' },
      { label: 'Classes', value: '10' }
    ]
  },
  staff: {
    title: 'Staff',
    description: 'Teacher and staff list.',
    items: [
      { name: 'Mr. John Smith', role: 'Teacher' },
      { name: 'Ms. Sarah Johnson', role: 'Teacher' }
    ]
  },
  students: {
    title: 'Students',
    description: 'Students list and fee status.',
    items: [
      { name: 'Aaryan Singh', status: 'Pending fees' },
      { name: 'Priya Sharma', status: 'Paid' }
    ]
  }
};

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedSection = sections[activeSection];

  return (
    <div className="min-h-screen bg-linear-to-br from-pastel-rose/30 via-pastel-peach/30 to-pastel-mint/30 text-slate-900">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SchoolHub</h1>
            <p className="text-sm text-slate-600">Bright pastel minimal layout.</p>
          </div>
          <button className="md:hidden rounded-lg bg-pastel-peach px-3 py-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? 'Hide' : 'Show'} menu
          </button>
        </header>

        <div className="grid md:grid-cols-[220px_1fr] gap-5">
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block`}>
            <div className="rounded-xl border border-pastel-lavender/40 bg-white/90 p-4 space-y-2">
              {Object.keys(sections).map(key => (
                <button
                  key={key}
                  className={`w-full text-left rounded-lg px-3 py-2 font-semibold ${activeSection === key ? 'bg-pastel-mint text-slate-800' : 'text-slate-700 hover:bg-pastel-peach/30'}`}
                  onClick={() => setActiveSection(key)}
                >
                  {sections[key].title}
                </button>
              ))}
            </div>
          </aside>

          <main className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {sections.dashboard.items.map(item => (
                <div key={item.label} className="rounded-xl border border-pastel-lavender/30 bg-white/85 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>

            <section className="rounded-2xl border border-pastel-lavender/40 bg-white/90 p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedSection.title}</h2>
              <p className="text-slate-600 mb-4">{selectedSection.description}</p>
              <div className="space-y-2">
                {selectedSection.items.map((row, idx) => (
                  <div key={idx} className="rounded-lg bg-pastel-rose/20 p-3">
                    <p className="font-semibold text-slate-800">{row.name ?? row.label}</p>
                    <p className="text-sm text-slate-700">{row.role ?? row.status ?? row.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
