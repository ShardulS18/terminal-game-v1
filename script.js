// Initialize the terminal
const terminal = new Terminal();
terminal.open(document.getElementById('terminal-container'));

// Display a welcome message
terminal.write("Welcome to the online console!\r\nType 'help' to see available commands.\r\n");

// Set up a command buffer to capture input
let commandBuffer = "";

// Handle key input in the terminal
terminal.onData((data) => {
    const code = data.charCodeAt(0);

    // If Enter key is pressed (char code 13), execute command
    if (code === 13) { 
        executeCommand(commandBuffer);
        commandBuffer = ""; // Clear the buffer after executing the command
    } 
    // If Backspace is pressed
    else if (code === 127) {
        if (commandBuffer.length > 0) {
            commandBuffer = commandBuffer.slice(0, -1);
            terminal.write("\b \b"); // Remove character visually
        }
    } 
    // Append other characters to the command buffer
    else {
        commandBuffer += data;
        terminal.write(data); // Display typed character in the terminal
    }
});

// Function to process commands
function executeCommand(command) {
    // Clear the line after the command
    terminal.write('\r\n');
    
    if (command.trim() === "help") {
        terminal.write("Available commands:\r\n- help: Display this help message\r\n- clear: Clear the console\r\n- cd next: Go to the next image\r\n- cd back: Go to the previous image\r\n");
    } else if (command.trim() === "clear") {
        terminal.clear();
    } else if (command.trim() === "cd next") {
        changeImage(1); // Move to the next image
    } else if (command.trim() === "cd back") {
        changeImage(-1); // Move to the previous image
    } else {
        terminal.write(`Command not found: ${command}\r\n`);
    }

    // Prompt for next input
    terminal.write("\r\n$ ");
}

// Initial prompt
terminal.write("$ ");

// Initialize the PIXI application
const app = new PIXI.Application();
app
  .init({ background: "#1099bb", resizeTo: window })
  .then(async () => {
    document.getElementById("pixi-container").appendChild(app.view);

    // Load image textures
    const texture1 = await PIXI.Assets.load("Tajmahal_Sunset.svg"); // Replace with correct path
    const texture2 = await PIXI.Assets.load("Tajmahal_Night.svg"); // Replace with correct path

    // Create sprites from textures
    const sprite1 = PIXI.Sprite.from(texture1);
    const sprite2 = PIXI.Sprite.from(texture2);

    // Configure sprites
    [sprite1, sprite2].forEach(sprite => {
      sprite.anchor.set(0.7);
      sprite.scale.set(0.7); // Adjust as necessary
      sprite.width = app.renderer.screen.width;
      sprite.height = app.renderer.screen.height;
      sprite.position.set(app.renderer.screen.width / 1.5, app.renderer.screen.height / 1.5);
    });

    // Store sprites in an array
    images = [sprite1, sprite2];
    app.stage.addChild(images[currentIndex]); // Display the first image
  })
  .catch(error => {
    console.error("Error initializing Pixi.js application:", error);
  });

// Array to hold images and track current index
let images = [];
let currentIndex = 0;

// Function to change images based on command
function changeImage(direction) {
    // Remove the current image from the stage
    app.stage.removeChild(images[currentIndex]);

    // Update the index, wrapping around as needed
    currentIndex = (currentIndex + direction + images.length) % images.length;

    // Display the new image
    app.stage.addChild(images[currentIndex]);
}
