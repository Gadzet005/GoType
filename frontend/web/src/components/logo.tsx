export const Logo = () => {
    const version = Date.now();

  return (
    <img 
      width={100} 
      src={`/favicon.png?v=${version}`} 
      alt="Logo" 
    />
  );
 }