document.addEventListener("DOMContentLoaded", () => {

    const canvas =  document.getElementById("canvas");
    const prompt = document.getElementById("prompt");

    let mouseX = 0, mouseY = 0;
    let initial_pos = [0, 0], final_pos = [0, 0];
    var generating = false;

    const draw_on_canvas = async (data, x, y, w, h) => {
        /** @type {CanvasRenderingContext2D} */
        const ctx = canvas.getContext("2d");
        
        const image = new Image();
        image.src = data;

        image.onload = () => {
            ctx.drawImage(image, x , y, w - x, h - y);
            console.log("imagem colocada");
        }
    };

    const reset = async () => {
        initial_pos = [0, 0];
        final_pos = [0, 0];
    };

    const handleMousePos = async (e) => {

        if (generating) {
            return;
        }

        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    const set_mouse_pos = async () => {
   
        if (generating) {
            return;
        }

        console.log("pos incial:", initial_pos);
        initial_pos = [mouseX, mouseY];
    };

    const set_final_pos = async () => {

        if (generating) {
            return;
        }

        final_pos = [mouseX, mouseY];
        console.log("pos final:", final_pos);

        if (final_pos[0] && final_pos[1] && !generating && prompt.value != "") {
            createWindow();
        }
    }

    const generate_image = async () => {

        console.log("gerando...");
        
        // api pra gerar imagem
        const response = await fetch(`${API_URL}/${prompt.value}`, {
            method: "get"
        });

        const data = await response.json();

        await draw_on_canvas(data.data, initial_pos[0], initial_pos[1], final_pos[0], final_pos[1]);
        reset();

        generating = false;
    };

    const createWindow = async () => {

        generating = true;

        if (initial_pos[0] == final_pos[0] || initial_pos[1] == final_pos[1]) {
            console.log("reset pois posicao inicial e igual a posicao final");
            reset();
        }

        await generate_image();
    };

    canvas.addEventListener("mousemove", handleMousePos);
    canvas.addEventListener("mousedown", set_mouse_pos);
    canvas.addEventListener("mouseup", set_final_pos);
});