(function(){
    console.log('main');
    let canvasElement = document.getElementById('canvas');
    let ctx = canvasElement.getContext('2d');
    let mousePos = [0,0];
    const easingFactor = 5.0;
    const backgroundColor = '#000';
    const nodeColor = '#fff';
    const edgeColor = '#fff';
    const nodes = [];
    const edges = [];

    let addEdge = ()=>{
        let ignore = false;
        edges.forEach(e=>{
            if(e.from == edge.from && e.to == edge.to || e.to == edge.from && e.from == edge.to){
                ingore = true;
            }
            if(!ignore){
                edges.push(edge);
            }
        });
    }


    let constructNodes = ()=>{
        for(let i = 0;i<100;i++){
            let node = {
                drivenByMouse:i == 0,
                x: Math.random()*canvasElement.width,
                y: Math.random()*canvasElement.height,
                vx: Math.random()*1-0.5,
                vy: Math.random()*1-0.5,
                radius: Math.random()>0.9?3+Math.random()*3:1+Math.random()*3
            };
            nodes.push(node);
        }
        nodes.forEach( e=>{
            nodes.forEach( e2=>{
                if(e==e2){
                    return;
                }
                var edge = {
                    from:e,
                    to:e2
                };
                addEdge(edge);
            });
        });
    }

    let adjustNodeDrivenByMouse = ()=>{
        nodes[0].x+= (mousePos[0]-nodes[0].x) / easingFactor;
        nodes[0].y+= (mousePos[1]-nodes[0].y) / easingFactor;
    }

    let step = ()=>{
        console.log("step");
        nodes.forEach(e=>{
            if(e.drivenByMouse){
                return;
            }
            e.x+=e.vx;
            e.y+=e.vy;
            let clamp = (min,max,value)=>{
                if(value>max){
                    return max;
                }else if(value<min){
                    return min;
                }else{
                    return value;
                }
            }
            if(e.x<=0 || e.x>=canvasElement.width){
                e.vx *=-1;
                e.x = clamp(0,canvasElement.width,e.x);
            }
            if(e.y<=0 || e.y>=canvasElement.height){
                e.vy *=-1;
                e.y = clamp(0,canvasElement.height,e.y);
            }
            adjustNodeDrivenByMouse();
            render();
            window.requestAnimationFrame(step);
        });
    }

    let lengthOfEdge = (edge)=>{
        return Math.sqrt(Math.pow((edge.from.x-edge.to.x),2)+Math.pow((edge.from.y-edge.to.y),2));
    }

    let render = ()=>{
        console.log("render");
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0,0,canvasElement.width,canvasElement.height);
        let threshold = canvasElement.width/8;
        edges.forEach(e=>{
            var length = lengthOfEdge(e);
            if(length>threshold){
                return;
            }
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = (1.0-l/threshold)*0.25;
            ctx.globalApha = 1.0 - l/threshold;
            ctx.beginPath();
            ctx.moveTo(e.from.x,e.from.y);
            ctx.lineTo(e.to.x,e.to.y);
            ctx.stroke();
        });
        ctx.globalApha = 1.0;
        nodes.forEach(e=>{
            if(e.drivenByMouse){
                return;
            }
            ctx.fillStyle = nodeColor;
            ctx.beginPath();
            ctx.arc(e.x,e.y,e.radius,0,2 * Math.PI);
        });

    }

    window.onresize = function(){
        canvasElement.width = document.body.clientWidth;
        canvasElement.height = document.body.clientHeight;
        if(nodes.length == 0){
            constructNodes();
        }
        render();

    }
    window.onmousemove = function(e){
        mousePos = [e.clientX,e.clientY];
    }

    window.onresize();
    window.requestAnimationFrame(step);


}).call(this);