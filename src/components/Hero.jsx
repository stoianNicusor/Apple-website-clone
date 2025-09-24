import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { heroVideo, smallHeroVideo } from "../utils";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo);
  
  const handeVideoWidth = () =>{
    if(window.innerHeight < 760){
      setVideoSrc(smallHeroVideo);
    }else{
      setVideoSrc(heroVideo);
    }
  }
  useEffect(()=>{
    window.addEventListener('resize', handeVideoWidth);
    return ()=>{
      window.removeEventListener('resize', handeVideoWidth);
    }
  },[])
  useGSAP(()=>{
    gsap.to("#hero",{
      opacity:1,
      delay:2
    })
    gsap.to("#cta",{
      opacity:1,
      delay:2,
      y:-20
    })
  },[])
  return (
    <section className='w-full nav-height bg-blog relative'>
      <div className='h-5/6 w-full flex-center flex-col'>
        <p id="hero" className='hero-title'> iPhone 16 pro max</p>
        <div className='md:w-10/12 w-9/12'>
          <video className='pointer-event-none`' autoPlay muted playsInline={true} key={videoSrc}>
            <source src={videoSrc} type='video/mp4'/>
          </video>
        </div>
        
        <div id="cta" className='flex flex-col items-center opacity-0 translate-y-20'>
          <a href='#highlights' className='btn'>Buy</a>
          <p className='font-normal text-xl'>From $199/month or $999 </p>
        </div>
      </div>
    </section>
  )
}

export default Hero