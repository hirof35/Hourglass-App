import { useRef, useEffect, useState } from 'react';

const RealSandHourglass = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // 容器の形（ひょうたん型）
  const isInsideContainer = (x: number, y: number) => {
    const dy = Math.abs(y - 100);
    const radius = 10 + (dy * 0.4);
    return Math.abs(x - 50) < radius;
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    // 1. グリッドの作成（壁の外は砂を置かない、壁の中はisFlippedに応じて配置）
    let grid = Array.from({ length: 200 }, (_, y) => 
      Array.from({ length: 100 }, (_, x) => {
        if (!isInsideContainer(x, y)) return 0;
        return isFlipped ? (y > 105 ? 1 : 0) : (y < 80 ? 1 : 0);
      })
    );

    const animate = () => {
      // 2. 砂の落下ロジック（容器内のみ計算）
      for (let y = 198; y >= 0; y--) {
        for (let x = 0; x < 100; x++) {
          if (grid[y][x] === 1) {
            // 1. まず「真下が空か？」を判定
            const canGoDown = isInsideContainer(x, y + 1) && grid[y + 1][x] === 0;
      
            if (canGoDown) {
              // 真下が空なら移動
              grid[y + 1][x] = 1;
              grid[y][x] = 0;
            } else {
              // 2. 真下が埋まっていたら、左右斜め下へ移動を試みる（拡散ロジック）
              const dirs = Math.random() > 0.5 ? [1, -1] : [-1, 1];
              for (let dx of dirs) {
                if (isInsideContainer(x + dx, y + 1) && grid[y + 1][x + dx] === 0) {
                  grid[y + 1][x + dx] = 1;
                  grid[y][x] = 0;
                  break; // 左右どちらかに動けたら計算終了
                }
              }
            }
          }
        }
      }

      // 3. 描画
      ctx.clearRect(0, 0, 100, 200);
      
      // 枠線を描画（壁は常に描画）
      ctx.fillStyle = '#333';
      for (let y = 0; y < 200; y++) {
        for (let x = 0; x < 100; x++) {
          if (!isInsideContainer(x, y)) ctx.fillRect(x, y, 1, 1);
        }
      }

      // 砂を描画
      ctx.fillStyle = '#d2b48c';
      for (let y = 0; y < 200; y++) {
        for (let x = 0; x < 100; x++) {
          if (grid[y][x] === 1) ctx.fillRect(x, y, 2, 2);
        }
      }
      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [isFlipped]);

  return (
    <div onClick={() => setIsFlipped(!isFlipped)} style={{ textAlign: 'center', cursor: 'pointer' }}>
      <canvas ref={canvasRef} width={100} height={200} style={{ border: '2px solid black' }} />
      <p>クリックして反転</p>
    </div>
  );
};

export default RealSandHourglass;