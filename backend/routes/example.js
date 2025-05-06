exports.getMessage = async (event, args) => {
    return { msg: `Hello from the backend! Received: ${args.name}` };
  };
  