import { useState } from 'react';
import { analyze } from '@/analysis/analysis-engine-core';

export default function MessageInput(){
  const [txt,setTxt]=useState(''); const [res,setRes]=useState(null);
  return (
    <>
      <textarea 
        className="message-input"
        value={txt} 
        onChange={e=>setTxt(e.target.value)}
        placeholder="Введите текст для анализа..."
      />
      <button 
        className="analyze-btn"
        onClick={()=>analyze(txt).then(setRes)}
      >
        Analyze
      </button>
      {res && <pre className="result">{JSON.stringify(res,null,2)}</pre>}
    </>
  );
}
