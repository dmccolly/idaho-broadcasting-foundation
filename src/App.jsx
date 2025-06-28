import { useState } from 'react';
import VoxProPlayer from './components/VoxProPlayer';
import VoxProManagement from './components/VoxProManagement';

// Placeholder components for other pages
const RadioPage = () => <div className="p-8 text-white">
    <h1 className="text-3xl font-bold text-green-400">Radio Content</h1>
    <p>This is the main radio page content area.</p>
</div>;

const NewsSocialPage = () => <div className="p-8 text-white">
    <h1 className="text-3xl font-bold text-green-400">News & Social</h1>
    <p>This is the news and social media integration page.</p>
</div>;

const EngineeringPage = () => <div className="p-8 text-white">
    <h1 className="text-3xl font-bold text-green-400">Engineering</h1>
    <p>This is the engineering dashboard page.</p>
</div>;

const App = () => {
  const [activeTab, setActiveTab] = useState('The Back Corner');

  const renderContent = () => {
    switch (activeTab) {
      case 'The Back Corner':
        return (
          <div className="h-full flex flex-col md:flex-row gap-4 p-4">
            <div className="md:w-1/2 h-full flex flex-col">
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 flex-grow">
                    <h2 className="text-2xl font-bold text-green-400 mb-2">Column 1</h2>
                    <p className="text-gray-300">This is the left column. You can place introductory text, instructions, or other components here.</p>
                </div>
            </div>
            <div className="md:w-1/2 h-full flex flex-col">
               <VoxProPlayer />
            </div>
          </div>
        );
      case 'Radio':
        return <RadioPage />;
      case 'News/Social':
        return <NewsSocialPage />;
      case 'Admin':
        return (
          <div className="p-4">
            <VoxProManagement />
          </div>
        );
      case 'Engineering':
        return <EngineeringPage />;
      default:
        return <div className="p-8 text-white">Select a tab</div>;
    }
  };

  const tabs = ['The Back Corner', 'Radio', 'News/Social', 'Admin', 'Engineering'];

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-white font-sans">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-green-400">Broadcasting Operations</h1>
        </div>
        <nav>
          <ul className="flex container mx-auto px-4 border-t border-gray-700">
            {tabs.map(tab => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 font-semibold transition-colors duration-200 ${
                    activeTab === tab
                      ? 'bg-gray-700 text-green-400 border-b-2 border-green-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
