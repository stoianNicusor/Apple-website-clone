import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";


const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    })

    const [loadData, setLoadData] = useState([])
    const {isEnd,isLastVideo, startPlay, videoId, isPlaying} = video;

    useGSAP(() => {
        gsap.to("#slider", {
          transform: `translateX(${-100 * videoId}%)`,
          duration: 2,
          ease: "power2.inOut", 
        });

        gsap.to("#video", {
          scrollTrigger: {
            trigger: "#video",
            toggleActions: "restart none none none",
          },
          onComplete: () => {
            setVideo((pre) => ({
              ...pre,
              startPlay: true,
              isPlaying: true,
            }));
          },
        });
      }, [isEnd, videoId]);

    
    const handleLoadedMetaData = (index,e) =>{
        setLoadData((prev)=> [...prev,e])
    } 
    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
    
        if (span[videoId]) {
          // animation to move the indicator
          let anim = gsap.to(span[videoId], {
            onUpdate: () => {
              // get the progress of the video
              const progress = Math.ceil(anim.progress() * 100);
    
              if (progress != currentProgress) {
                currentProgress = progress;
    
                // set the width of the progress bar
                gsap.to(videoDivRef.current[videoId], {
                  width:
                    window.innerWidth < 760
                      ? "10vw" // mobile
                      : window.innerWidth < 1200
                      ? "10vw" // tablet
                      : "4vw", // laptop
                });
    
                // set the background color of the progress bar
                gsap.to(span[videoId], {
                  width: `${currentProgress}%`,
                  backgroundColor: "white",
                });
              }
            },
    
            // when the video is ended, replace the progress bar with the indicator and change the background color
            onComplete: () => {
              if (isPlaying) {
                gsap.to(videoDivRef.current[videoId], {
                  width: "12px",
                });
                gsap.to(span[videoId], {
                  backgroundColor: "#afafaf",
                });
              }
            },
          });
    
          if (videoId == 0) {
            anim.restart();
          }
    
          // update the progress bar
          const animUpdate = () => {
            anim?.progress(
              videoRef.current[videoId].currentTime /
                hightlightsSlides[videoId].videoDuration
            );
          };
    
          if (isPlaying) {
            // ticker to update the progress bar
            gsap.ticker.add(animUpdate);
          } else {
            // remove the ticker when the video is paused (progress bar is stopped)
            gsap.ticker.remove(animUpdate);
          }
        }
      }, [videoId, startPlay]);
    
    useEffect(() => {
        if (loadData.length > 3) {
          if (!isPlaying) {
            videoRef.current[videoId].pause();
          } else {
            startPlay && videoRef.current[videoId].play();
          }
        }
      }, [startPlay, videoId, isPlaying, loadData]);

    const handleProcess = (type,index) =>{
        switch (type){
            case "video-end":
                setVideo((prevVideo) => ({...prevVideo, isEnd:true, videoId: index+1 }));
            break;
            case "video-last":
                setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
            break;
            case "video-reset":
                setVideo((prevVideo) => ({...prevVideo, videoId:0, isLastVideo: false }));
            break;
            case "play":
                setVideo((prevVideo) => ({...prevVideo, isPlaying: !prevVideo.isPlaying,  }));
            break;
            case "pause":
                setVideo((prevVideo) => ({...prevVideo, isPlaying: !prevVideo.isPlaying,  }));
            break;
            default:
                return video;
        }
    }
  return (
    <div>
        <div className='flex items-center'>
            {hightlightsSlides.map((item,index) =>( 
                <div key={item.id} id="slider" className='sm:pr-20 pr-10'>
                    <div className='video-carousel_container'>
                        <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                        <video 
                         id="video"
                         playsInline={true}
                         preload='auto'
                         muted
                         ref={(el)=> (videoRef.current[index] = el)}
                         onPlay={()=>{
                            setVideo((prevVideo)=> ({...prevVideo,isPlaying:true}))
                         }}
                         onLoadedMetadata={ (e)=> handleLoadedMetaData(index,e)}

                         onEnded={() =>
                            index !== 3
                              ? handleProcess("video-end", index)
                              : handleProcess("video-last")
                          }
                          className={`${item.id == 2 && "translate-x-44"} pointer-events-none`}
                        >
                            <source src={item.video} type="video/mp4" />
                        </video>
                        </div>
                        <div className='absolute top-12 left-[5%] z-10'>
                            {item.textLists.map((text)=>(
                                <p key={text} className='md:text-xl text-xl font-medium'>
                                    {text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            )) }
        </div>
        <div className='relative flex-center mt-10'>
            <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
                {videoRef.current.map((_,index)=>(
                    <span  key={index} ref={(el) => (videoDivRef.current[index] = el) } className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'>
                        <span className='absolute h-full w-full rounded-full' ref={(el) => (videoSpanRef.current[index] = el) }  ></span>
                    </span>
                ))}
            </div>
            <button className='control-btn'                     
                onClick={
                  isLastVideo
                  ? () => handleProcess("video-reset")
                  : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
                }>
                <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                    alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                />
            </button>
        </div>
    </div>
  )
}

export default VideoCarousel