// Synthetic UI fixture, imported only by the intercepted browser test page.
// Never imported by production code or published as application data.
import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {WorldMap} from '../src/WorldMap';
import '../src/index.css';
import '../src/mvp.css';
import type {MapSite} from '../src/mapData';
const sites: MapSite[] = [
 {id:'test-a',name:'Synthetic A',region:'Test region',group:'Featured',coordinates:[0,0],coordinate_status:'APPROVED'},
 {id:'test-b',name:'Synthetic B',region:'Test region',group:'Control',coordinates:[10,10],coordinate_status:'APPROVED'},
 {id:'test-pending',name:'Synthetic pending',region:'Test region',group:'Benchmark',coordinates:[20,20],coordinate_status:'PENDING_HUMAN_REVIEW'},
];
function Fixture(){
 const [active,setActive]=useState(''); const [filter,setFilter]=useState(false);
 return <><h1>TEST FIXTURE ONLY</h1><button onClick={()=>setActive('test-a')}>Select list A</button><button onClick={()=>setFilter(!filter)}>Toggle filter</button><output>{active}</output><WorldMap sites={filter?sites.slice(0,1):sites} activeSiteId={active} onSelectSite={setActive}/></>;
}
export function mount() { createRoot(document.getElementById('root')!).render(<Fixture/>); }
