/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

type UseWaveSurferProps = {
  file: File | undefined;
  videoRef: React.RefObject<HTMLVideoElement>;
};

export const useWaveSurfer = (props: UseWaveSurferProps) => {
  const { file, videoRef } = props;
  const waveformRef = useRef<HTMLDivElement>(null);
  const region = useRef<Region | null>(null);

  const getRegionTime = () => {
    return region.current
      ? { start: region.current.start, end: region.current.end }
      : { start: 0, end: 0 };
  };

  useEffect(() => {
    if (!waveformRef.current || !videoRef.current || !file) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#263238",
      progressColor: "rgb(100, 0, 100)",
      media: videoRef.current,
      // minPxPerSec: 10,
      plugins: [
        TimelinePlugin.create(),
        Hover.create({
          lineColor: "#ff0000",
          lineWidth: 1,
          labelBackground: "#555",
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
    });

    ws.on("interaction", async () => {
      await ws.play();
    });

    // 添加 RegionsPlugin
    const wsRegion = ws.registerPlugin(RegionsPlugin.create());
    wsRegion.enableDragSelection({
      color: "rgba(0, 0, 255, 0.3)",
    });

    // 監聽 region-created 事件，當新的 region 被建立時，移除其他 region
    wsRegion.on("region-created", async (newRegion) => {
      wsRegion.getRegions().forEach((r) => {
        if (r !== newRegion) {
          r.remove();
        }
      });
      ws.setTime(newRegion.start);
      region.current = newRegion;
      await ws.play();
    });

    // region 被拖動或縮放時，更新目前播放時間
    wsRegion.on("region-updated", (newRegion) => {
      newRegion.play();
    });

    return () => {
      ws.destroy();
    };
  }, [file, videoRef]);

  return {
    waveformRef,
    getRegionTime,
  };
};
