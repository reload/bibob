const Ajv = require('ajv')
const fs = require('fs')

fs.readdir('schema', function (err, items) {
    let ajv = new Ajv({ 'allErrors': true })
    for (var i = 0; i < items.length; i++) {
        let schema = JSON.parse(fs.readFileSync(`schema/${items[i]}`, 'utf8'))
        ajv = ajv.addSchema(schema)
    }

    let validate = ajv.getSchema("http://biblstandard.dk/abm/bibob/bibob.schema.json")
    fs.readdir('examples/bibob/', function (err, items) {
        for (var i = 0; i < items.length; i++) {
            process.stdout.write(`Validating "${items[i]}": `);
            let source = JSON.parse(fs.readFileSync(`examples/bibob/${items[i]}`, 'utf8'))
            const valid = validate(source)
            if (!valid) {
                process.stdout.write(`${validate.errors.length} error(s) found:\n`)
                validate.errors.forEach(function (error, i) {
                    console.log(i + 1 + ":")
                    console.log(error)
                });
            }
            else {
                process.stdout.write("Valid\n")
            }
            process.stdout.write("\n")
        }
    })

})

