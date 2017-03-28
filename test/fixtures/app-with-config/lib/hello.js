module.exports = async (ctx, next) => {
  if (ctx.path === '/hello') {
    ctx.body = 'hello';
  } else {
    await next();
  }
};
