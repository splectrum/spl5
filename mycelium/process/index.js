const { register } = require('./dispatch')

register('spl.mycelium.process.execute', require('./execute'))
