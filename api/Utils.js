const { VM } = require( 'vm2' );
const fs = require('fs');

module.exports = {
    execute: (inputs,code,isMathIncluded) => {
        return execute(inputs,code,isMathIncluded)
    },
};

function execute (inputs,code,isMathIncluded) {
    let args = [];

    //console.log(JSON.stringify(inputs));
    if(inputs)
    {
        for(let i = 0; i <inputs.length; i++)
        {
            switch (inputs[i].type) {
                case "Integer":
                    args.push(randomInt(inputs[i].min,inputs[i].max));
                    break;
                case "Decimal":
                    args.push(randomDecimal(inputs[i].min,inputs[i].max));
                    break;
                default:
                    return {logs:'Error wrong input'};
                    break;
            }
        }
        code+=`
            ext.exports = main(` + JSON.stringify(args) + `); // function call
            `;
    }
    else
    {
        code+=`
            ext.exports = main(); // function call
            `;
    }

//console.log(args);

    let logs = "";
    let ext = {};

    const vm = new VM( {
        timeout:500, //Maybe need to be changed
        eval:false,
        wasm:false,
        fixAsync:true,
        console: 'redirect',
        // pass our declared ext variable to the sandbox
        sandbox: {
            ext,
            console: {
                log: function(str) { logs+="\n"+str; }
            }
        }
    } );

// run your code and see the results in ext
    try
    {
        //Includes lib
        if(isMathIncluded)
        {
            var mathScript = fs.readFileSync(__dirname + '/external_scripts/math.min.js',{ encoding: "utf8" });
            vm.run(mathScript);
        }

        vm.run(code);
    }
    catch (e) {
        return {logs:"Error: " + e,input:args};
    }

    return {logs:logs,output:ext.exports,input:args};
}

function randomInt (min, max) {
    min = Number(min);
    max = Number(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function randomDecimal (min, max) {
    min = Number(min);
    max = Number(max);
    return Math.random() * (max - min) + min;
}
