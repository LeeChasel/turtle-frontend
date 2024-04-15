import { useState } from "react";

function MusicTesting() {
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };
  return (
    <>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>
    </>
  );
}
export default MusicTesting;
