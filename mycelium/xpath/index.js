const { register } = require('../process/dispatch')
const rawuri = require('./raw/uri')

register('spl.mycelium.xpath.raw.uri.get', rawuri.get)
register('spl.mycelium.xpath.raw.uri.put', rawuri.put)
register('spl.mycelium.xpath.raw.uri.remove', rawuri.remove)
