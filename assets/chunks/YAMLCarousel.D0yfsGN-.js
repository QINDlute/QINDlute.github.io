import{_ as g,h as f,p as m,v as C,c as t,o as s,j as e,e as _,F as v,B as h,n as B,t as i,N as x,u as L,b as M}from"./framework.B7XirQ9q.js";const w={class:"VPDoc-carousel has-sidebar has-aside"},z={class:"carousel"},D={class:"carousel-item_info"},I={key:0,class:"carousel-item_subtitle"},S={class:"carousel-item_title"},N={key:1,class:"carousel-item_description"},V={class:"carousel-item_poem"},A={class:"poem-content"},F={key:0,class:"carousel_nav"},$={__name:"CarouselComponent",props:{items:{type:Array,default:()=>[]}},setup(p){const o=p,a=f(()=>o.items&&o.items.length>0?o.items:[{subtitle:"唐诗",title:"静夜思",description:"李白 (唐代)",poem:`床前明月光
疑是地上霜
举头望明月
低头思故乡`},{subtitle:"唐诗",title:"登鹳雀楼",description:"王之涣 (唐代)",poem:`白日依山尽
黄河入海流
欲穷千里目
更上一层楼`},{subtitle:"唐诗",title:"春晓",description:"孟浩然 (唐代)",poem:`春眠不觉晓
处处闻啼鸟
夜来风雨声
花落知多少`},{subtitle:"唐诗",title:"相思",description:"王维 (唐代)",poem:`红豆生南国
春来发几枝
愿君多采撷
此物最相思`},{subtitle:"唐诗",title:"赋得古原草送别",description:"白居易 (唐代)",poem:`离离原上草
一岁一枯荣
野火烧不尽
春风吹又生`}]),l=m(0),c=m(!1);C(()=>{setTimeout(()=>{c.value=!0},100)});const b=()=>{l.value=(l.value+1)%a.value.length},k=()=>{l.value=(l.value-1+a.value.length)%a.value.length};return(E,r)=>(s(),t("div",w,[e("div",z,[(s(!0),t(v,null,h(a.value,(n,u)=>(s(),t("div",{key:u,class:B(["carousel-item",`carousel-item--${u+1}`,{active:c.value&&l.value===u}])},[e("div",D,[n.subtitle?(s(),t("p",I,i(n.subtitle),1)):_("",!0),e("h2",S,i(n.title),1),n.description?(s(),t("p",N,i(n.description),1)):_("",!0)]),e("div",V,[e("div",A,[(s(!0),t(v,null,h(n.poem.split(`
`),(y,d)=>(s(),t("p",{key:d,class:"poem-line",style:x({"--line-index":d})},i(y),5))),128))])])],2))),128)),a.value.length>1?(s(),t("div",F,[e("div",{class:"carousel_arrow",onClick:k},[...r[0]||(r[0]=[e("svg",{class:"carousel_icon",viewBox:"0 0 24 24"},[e("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"})],-1)])]),e("div",{class:"carousel_arrow",onClick:b},[...r[1]||(r[1]=[e("svg",{class:"carousel_icon",viewBox:"0 0 24 24"},[e("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"})],-1)])])])):_("",!0)])]))}},j=g($,[["__scopeId","data-v-aff1b6d9"]]),T={__name:"YAMLCarousel",setup(p){const{frontmatter:o}=L(),a=f(()=>o.value?o.value.carouselItems||o.value.carouselItems1||[]:[]);return(l,c)=>(s(),M(j,{items:a.value},null,8,["items"]))}};export{T as _};
