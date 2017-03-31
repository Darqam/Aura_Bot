module.exports = event => {
    console.log(`Bot disconnected at ${new Date()} with error code: ${event.code}`);
    if(event.code === 1000) process.exit();
};
