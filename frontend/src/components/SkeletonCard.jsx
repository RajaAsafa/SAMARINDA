const SkeletonCard = () => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
      <div style={{ padding: '20px' }}>
        <div className="skeleton" style={{ height: '12px', width: '30%', marginBottom: '16px' }}></div>
        <div className="skeleton" style={{ height: '24px', width: '100%', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '16px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '6px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '90%' }}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
