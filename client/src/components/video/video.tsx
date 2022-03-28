import React from "react";
import { VideoWrapper } from "@/components/video/styles";
import { useAppState } from "@/state/app-state";

type Props = {
  onEnded: () => void;
};

export default React.forwardRef(function Video(
  { onEnded }: Props,
  ref: React.ForwardedRef<HTMLVideoElement>
) {
  const { interacted } = useAppState();

  return (
    <VideoWrapper>
      <video
        ref={ref}
        src="/assets/videos/day/default.mp4"
        muted={!interacted}
        autoPlay
        playsInline
        onEnded={onEnded}
      />
    </VideoWrapper>
  );
});
