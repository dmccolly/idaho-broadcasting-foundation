import VoxProSystem from './VoxProSystem.jsx';
import VoxProManagement from './VoxProManagement.jsx';

const AdminVoxProPage = () => {
  const openPopup = () => {
    const top = window.innerHeight - 500;
    const features = `width=500,height=500,left=0,top=${top < 0 ? 0 : top}`;
    window.open('/voxpro-player', 'voxproPlayer', features);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">VoxPro Player</h2>
            <button
              onClick={openPopup}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Pop‑out
            </button>
          </div>
          <VoxProSystem mode="player" />
        </div>
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-lg shadow p-4">
          <VoxProManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminVoxProPage;
