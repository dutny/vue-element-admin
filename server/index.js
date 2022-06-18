const Koa = require('koa')
const KoaStatic = require('koa-static')
const path = require('path')
const fs = require('fs')
const app = new Koa()

const resolve = file => path.resolve(__dirname, file)

app.use(KoaStatic(resolve('../dist')))

const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientMain = require('../dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve('../ssr/index.html', 'utf-8')),
  clientManifest: clientMain
})

function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

app.use(async(ctx, next) => {
  const context = {
    title: 'ssr template',
    url: ctx.url
  }
  const html = renderToString(context)
  ctx.body = html
})

app.listen(3000, () => {
  console.log('Now the server is listening port 3000')
})
