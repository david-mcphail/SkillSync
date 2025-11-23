import React, { useEffect, useRef } from 'react';

const ParticleNetwork: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReduced.matches) {
            // Do not animate if user prefers reduced motion
            return;
        }

        const width = canvas.parentElement?.clientWidth || window.innerWidth;
        const height = canvas.parentElement?.clientHeight || window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
        const particleCount = Math.min(100, Math.floor((width * height) / 8000));
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
            });
        }

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(108, 99, 255, 0.6)';
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            // draw lines
            ctx.strokeStyle = 'rgba(108, 99, 255, 0.2)';
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const update = () => {
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            });
            draw();
            requestAnimationFrame(update);
        };
        update();

        const handleResize = () => {
            const newWidth = canvas.parentElement?.clientWidth || window.innerWidth;
            const newHeight = canvas.parentElement?.clientHeight || window.innerHeight;
            canvas.width = newWidth;
            canvas.height = newHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

export default ParticleNetwork;
