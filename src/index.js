import React, { useEffect, useState, useCallback } from "react";
// import iconsMap from "./fonts/MaterialIcons-Regular.json";
// import test from "./fonts_main/test";
import metaData from "./fonts_main/meta.json";
import axios from "axios";
import styled from "styled-components";

const shapes = {
  rounded: { title: "Өнцөггүй" },
  sharp: { title: "Хурц өнцөгтэй" },
  // outlined: { title: "outlined" },
};

const categories = [...new Set(metaData.icons.map(item=>item.categories.at(0)).sort())]

// const mainColor = "#1a73e8";
function KeyPress(targetKey, handleFunc, passValue) {
  const keyPress = useCallback((e) => {
     if (!handleFunc) return;
     if (e.key === targetKey) {
        if (passValue) return handleFunc(passValue);
        handleFunc(false);
     }
  }, []);

  useEffect(() => {
     document.addEventListener('keydown', keyPress);
     return () => document.removeEventListener('keydown', keyPress);
  }, [keyPress]);
}


function App({open=true, setData, onClose}) {
  const [result, setResult] = useState([]);
  const [shape, setShape] = useState("rounded");
  const [ category, setCategory ] = useState('all')
  const [ sort, setSort ] = useState('popularity')
  // const [svgs, setSvgs] = useState([]);

  const [customize, setCustomize] = useState({
    isOpen:false,
    weight: "400",
    fill: 0,
    fontSize: 48,
  });

  // console.log(iconsMap);

  const fetchdata = async (props) => {
    if (!props) return;
    let weightVal =  customize.weight !== "400" ? `wght${customize.weight}` : `default`
    if(customize.fill === 1){
      if(weightVal !== "default"){
        weightVal =`${weightVal??``}fill1`
        return
      }
      weightVal = `fill1`
    }
    try{
      const res = await axios.get( `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${props}/${weightVal}/${customize.fontSize}px.svg`);
      if(setData){
        setData(res.data)
        onClose(false)
      }
    }catch(err){
      window.alert('Татах боломжгүй Icon - байна!')
    }
  };

  const searchHandle = (value) => {
   // almost google search    
    let result = metaData.icons.filter((item) => {
      if (
        item.name.replaceAll("_", " ").includes(value.toLowerCase()) ||
        item.name.replaceAll("_", "").includes(value.toLowerCase()) ||
        item.tags.includes(value.toLowerCase()) ||
        item.tags.find(items=>items.includes(value))
      ) {
        return item;
      }
      // return item;
    });

    setResult(result.map(item=>item.name).slice(0,300));

    // filter teigee hamt ajillana
    // filter iig oroltsuulj search hiij bolno
    // use transition geed uzej baisnaa sana ( input search hiihdee gatsaj baigaa )
  };

  const SelectHandle = (item) => {
    fetchdata(item);
  };

  const customizeHandle = (name, value) => {
    setCustomize(prev=>({ ...prev, [name]:value }));
  };

  KeyPress('Escape', onClose, false);

  const categoryHandle = (value) =>{
    setCategory(value)
    const filtered = metaData.icons.filter(item => item.categories?.at(0) === value).map(el=>el.name)
    setResult(value === 'all'?metaData.icons.map(item=>item.name).slice(100,300):filtered)
  }

  // console.log()

  if(!open) return null

  React.useEffect(() => {
    document.querySelector('#iconlink')?.remove()
    document.querySelector('#iconlink2')?.remove()
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    link.rel = "stylesheet"
    link.setAttribute('id', 'iconlink')
    const link2 = document.createElement('link')
    link2.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    link2.rel = "stylesheet"
    link2.setAttribute('id', 'iconlink2')
    document.head.appendChild(link)
    document.head.appendChild(link2)

    // setResult(metaData.icons.map(item=>item.name).slice(100,400))
    setResult(metaData.icons.sort((a,b) => b.popularity - a.popularity).map(item=>item.name).slice(0,400))
  }, [])

  const sortHandle = (value) =>{
    setSort(value)
    if(value === "name"){
      setResult(metaData.icons.sort((a,b) => a.name.localeCompare(b.name, 'en', { numeric:true })).map(item=>item.name).slice(0,400))
    }else{
      setResult(metaData.icons.sort((a,b) => b[value] - a[value]).map(item=>item.name).slice(0,400))
    }
  }

  return (
    <Container
      fill={customize.fill}
      weight={customize.weight ?? "400"}
      fontSize={customize.fontSize}
      className="App"
      theme={{ mainColor: "#1a73e8" }}
    >
      <div className="content_praent">
        {/* <span className="Container" dangerouslySetInnerHTML={{__html: svgs}}></span> */}
        <div className="header">
          <div className="search_item">
            
            <input
              className="search_inp"
              placeholder="Хайх..."
              onChange={(e) => searchHandle(e.target.value)}
            />
            <select value={category} onChange={(e)=>categoryHandle(e.target.value)}>
              <option value="all">Ангилах</option>
              {categories.map((el,ind) =>{
                return(
                  <option key={ind} value={el}>{el}</option>
                )
              })}
            </select>

             <select value={sort} onChange={(e)=>sortHandle(e.target.value)}>
              <option value="popularity">Алдартай</option>
              <option value="name">Нэрээр</option>
            </select>
          </div>
         
          <div className="filter_sector">
            {/* {Object.keys(shapes).map((el, ind) => {
              return (
                <button
                  key={ind}
                  onClick={() => setShape(el)}
                  className={`filter_buttons ${el === shape ? `active` : ``}`}
                >
                  {shapes[el].title}
                </button>
              );
            })} */}
            
            <div onClick={()=>setCustomize(prev=>({ ...prev, isOpen:!prev.isOpen }))} className={`settings_button ${customize.isOpen?`settings_button_active`:``}`}>
              <span className="material-symbols-rounded">settings</span>
            </div>
          </div>
        </div>

        <div className="content_parent">
          <div className="parent_item">
            {result.map((item, ind) => {
              return (
                <div onClick={() => SelectHandle(item)} key={ind} className="icon_wrapper">
                  <div
                    className="icon_sector"
                  >
                    <span
                      className={`material-symbols material-symbols-${
                        shape === "filled" ? `rounded` : shape
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                  <div className="icon_name">{item.replaceAll('_', ' ')}</div>
                </div>
              );
            })}
          </div>

          {customize.isOpen && <div className={`edit_parent`}>
            <div className="fill_head">
              {Object.keys(shapes).map((el, ind) => {
                return (
                  <button
                    key={ind}
                    onClick={() => setShape(el)}
                    className={`filter_buttons ${el === shape ? `active` : ``}`}
                  >
                    {shapes[el].title}
                  </button>
                );
              })}
            </div>
            <div className="fill_head">
              <div className="title">Дүүргэх</div>
              <label className="switch">
                <input type="checkbox" checked={customize.fill === 1} onChange={(e)=>customizeHandle('fill', e.target.checked?1:0) } />
                <span className="slider round"></span>
              </label>
            </div>
            <RangeStyle theme={{ mainColor: "#1a73e8" }}>
              <div className="label">Зузаан нимгэн</div>
              <input
                className="range"
                type="range"
                step="100"
                min="100"
                max="700"
                value={customize.weight}
                onChange={(e) => customizeHandle('weight', e.target.value)}
                // onInput={()=>document.getElementById('hidden-foo').value=customize.weight}
              />
              <input hidden name="hidden-foo" id="hidden-foo" value="-1" readOnly />
              <div className="ticks">
                <span className="tick">100</span>
                <span className="tick"></span>
                <span className="tick"></span>
                <span className="tick"></span>
                <span className="tick"></span>
                <span className="tick"></span>
                <span className="tick">700</span>
              </div>
            </RangeStyle>
            <div className="fill_head">
              <div className="title">Фонт-хэмжээ</div>
              <select className="select" value={customize.fontSize}  onChange={e=>customizeHandle('fontSize', e.target.value)}>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="40">40</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>}
        </div>
      </div>
      <div className='ghost' onClick={()=>onClose?.(false)} />
    </Container>
  );
}

export default App;

const rangeslidersize = "4px";

const RangeStyle = styled.div`
  position: relative;
  padding-bottom:20px; 
  .label {
    color: #5f6368;
    margin-bottom: 10px;
    font-size:13px;
  }
  input[type="range"] {
    -webkit-appearance: none;
    border-radius: 5px;
    background-color: ${(props) => props.theme.mainColor};
    height: 4px;
    cursor: pointer;
    vertical-align: middle;
    width: 100%;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    position: relative;
    border-radius: 50px;
    height: 17px;
    width: 17px;
    background-color: ${(props) => props.theme.mainColor};
    &:hover {
      height: 20px;
      width: 20px;
    }
    &:before {
      content: "1";
      background-color: red;
    }
  }
  .ticks {
    display: flex;
    justify-content: space-between;
    padding: ${rangeslidersize} calc(${rangeslidersize} * 2);
    padding-top: 0px;
    padding-left: 9px;
  }
  .tick {
    position: relative;
    display: flex;
    justify-content: center;
    width: 1px;
    background: #5f6368;
    height: 5px;
    line-height: calc(${rangeslidersize} * 6);
    margin-bottom: calc(${rangeslidersize} * 2);
    color: #5f6368;
    font-size: 11px;
  }
`;

const Container = styled.div`
  position:fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  height:100vh;
  width:100vw;
  display: flex;
  justify-content: center;
  align-items:center;
  z-index:998;
  font-family: Arial, Helvetica, sans-serif;
  .ghost{
    background-color:rgba(0,0,0,0.4);
    position:fixed;
    left:0;
    top:0;
    right:0;
    bottom:0;
    height:100vh;
    width:100vw;
    z-index:999;
  }
  .content_praent {
    position:relative;
    z-index:1000;
    width: 500px;
    height:70vh;
    padding: 20px 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background-color:#fff;
    border-radius:10px;
    .range {
      &::-ms-thumb {
        background-color: red;
        border: 1px;
      }
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height:40px;
      gap:10px;
      .search_item {
        width:100%;
        display:flex;
        align-items:center;
        gap:10px;
        select{
          border: 1px solid rgba(0, 0, 0, 0.2);
          padding:6px 2px;
          border-radius: 5px;
          color:#5f6368;
          width:100px;
        }
        .search_inp {
          padding: 6px 10px;
          padding-left: 10px;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          flex:1;
        }
      }
      .filter_sector {
        display: flex;
        align-items: center;
        gap: 10px;
        .settings_button {
          user-select:none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 5px;
          background-color: rgba(0, 0, 0, 0.1);
          border: 1px solid #fff;
          .material-symbols-rounded {
            color: #5f6368;
            font-variation-settings: "FILL" 0;
          }
          &:hover {
            border: 1px solid #1a73e8;
            .material-symbols-rounded {
              font-variation-settings: "FILL" 1;
            }
          }
        }
        .settings_button_active{
            border: 1px solid #1a73e8;
            .material-symbols-rounded {
              color:#1a73e8;
              font-variation-settings: "FILL" 1;
            }
        }
      }
    }
    .content_parent {
      position: relative;
      display: flex;
      gap: 15px;
      margin-top: 25px;
     
      .edit_parent {
        background-color: #fff;
        position: absolute;
        transition:all 0.3s ease;
        top: 10px;
        bottom: 20px;
        width: 190px;
        border-radius: 8px;
        padding: 20px 15px;
        box-shadow: 0px 0px 12px -4px #000;
        display:flex;
        flex-direction:column;
        overflow-y:scroll;
        height: calc(70vh - 200px);
        right: 10px;
        gap:15px;
        .fill_head {
          display: flex;
          justify-content: space-between;
          align-items:center;
          padding-bottom: 10px;

          .filter_buttons {
            font-size: 11px;
            font-weight: 500;
            border: 1px solid rgba(0, 0, 0, 0.2);
            color: rgba(0, 0, 0, 0.6);
            padding: 7px 10px;
            padding-right: 16px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            white-space: nowrap;
            &:hover {
              background-color: rgba(0, 0, 0, 0.056);
            }
          }
          .active {
            background-color: rgba(0, 0, 0, 0.056);
            border: 1px solid #1a73e8;
            color: #1a73e8;
          }
          .select{
            width:50px;
            border:1px solid rgba(0,0,0,0.2);
            border-radius:5px;
            padding:2px 6px;
          }
          .title {
            font-weight:500;
            font-size:13px;
            color: #5f6368;
          }
          .switch {
            position: relative;
            display: inline-block;
            width: 38px;
            height: 22px;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
          }

          input:checked + .slider {
            background-color: #2196f3;
          }

          input:focus + .slider {
            box-shadow: 0 0 1px #2196f3;
          }

          input:checked + .slider:before {
            -webkit-transform: translateX(14px);
            -ms-transform: translateX(14px);
            transform: translateX(14px);
          }

          /* Rounded sliders */
          .slider.round {
            border-radius: 34px;
          }

          .slider.round:before {
            border-radius: 50%;
          }
        }
      }
      .parent_item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        max-height: calc(70vh - 90px);
        overflow-y: scroll;
        max-width:100%;
        .icon_wrapper {
          width: 70px;
          height: 70px;
          max-height: 70px;
          max-width: 70px;
          display: flex;
          overflow: hidden;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 5px;
          border-radius: 10px;
          cursor: pointer;
          // transition: all .2s;
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            .icon_sector {
              .material-symbols {
              }
            }
          }
          .icon_sector {
            display: flex;
            align-items: center;
            height: 80%;
            .material-symbols {
              color: #5f6368;
              font-size: ${props=>props.fontSize}px;
              font-variation-settings: "FILL" ${(props) => props.fill},
                "wght" ${(props) => props.weight ?? "400"}, "GRAD" 0, "opsz" ${props=>props.fontSize};
            }
          }
          .icon_name {
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 95%;
            color: #5f6368;
            text-align: center;
          }
        }
      }
    }
  }
`;

