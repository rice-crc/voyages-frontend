import BackGroundVideo from '@/assets/BlackWhiteWaves.mp4';
const VideoBackground = () => {
  return (
    <div className="video-background">
      <video autoPlay muted loop>
        <source src={BackGroundVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;
