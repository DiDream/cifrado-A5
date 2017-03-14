'use strict'
var
    body = $('body'),
    nextStep = $('button#next-step'),
    vectorSelectors= [
            $('#vector-LFSR-1 .elements .element'),
            $('#vector-LFSR-2 .elements .element'),
            $('#vector-LFSR-3 .elements .element')
        ],
    lfsr = [],
    newValues = [],
    shiftVector=[],
    method = stepOne;

nextStep.on('click',function(){

});
$('button#new-values').on('click',function(){
    body.addClass('modal-open');
});
$('#close-modal').on('click',function(){
    body.removeClass('modal-open');
});
$('#form-values').on('submit', function(e){
    e.preventDefault();
    body.removeClass('modal-open');
    GenerateVectors({
        'LFSR-1': $('#LFSR-1').val(),
        'LFSR-2': $('#LFSR-2').val(),
        'LFSR-3': $('#LFSR-3').val()
    });
});
$('#random-values').on('click', function(){

    GenerateVectors({
        'LFSR-1': RandomKey(19),
        'LFSR-2': RandomKey(22),
        'LFSR-3': RandomKey(23)
    });
});

function Shift(op, newValues){
    for(var i=0; i<op.length; i++){
        var index = op[i];
        lfsr[  index].pop()
        lfsr[ index ].unshift(newValues[i]);
        var j= lfsr[index].length -1;
        vectorSelectors[index].find('.value').each(function(){

            $(this).text(lfsr[index][j--]);
        });
    }

}
function stepOne(){

    newValues= [
        XorOperation([lfsr[0][18],lfsr[0][17],lfsr[0][16],lfsr[0][13]]),
        XorOperation([lfsr[1][21],lfsr[1][20]]),
        XorOperation([lfsr[2][22],lfsr[2][21],lfsr[2][20],lfsr[2][7]])
    ];

    $('#vector-LFSR-1 .value-in').text(newValues[0]);
    $('#vector-LFSR-2 .value-in').text(newValues[1]);
    $('#vector-LFSR-3 .value-in').text(newValues[2]);
    shiftVector = MajorityFunction([lfsr[0][8], lfsr[1][10], lfsr[2][10]]);
    method= stepTwo;
}
function stepTwo(){
    $('#vector-LFSR-1 .value-in').text('');
    $('#vector-LFSR-2 .value-in').text('');
    $('#vector-LFSR-3 .value-in').text('');
    $('#result').append(XorOperation([lfsr[0][18], lfsr[1][21], lfsr[2][22]]));
    Shift(shiftVector, newValues);
    method = stepOne;
}
$('#next-step').on('click', function(){

    method();





});
function MajorityFunction(op){
    // var ceros=0;
    // for(var i=0; i<operators.length; i++){
    //     if(operators[i]==0) ceros++;
    // }
    // return ceros<2? 1: 0;
    var major = (op[0] + op[1] + op[2]) <2? 0: 1;
    console.log(major);
    var shift=[];
    for(var i=0; i<op.length; i++){
        if(major==op[i]){
            vectorSelectors[i].css('border-color','#179D9C');
            shift.push(i);
        }
        else{
            vectorSelectors[i].css('border-color','red');
        }
    }
    return shift;
}
function XorOperation(operators){
    var result=0;
    for(var i=0; i<operators.length; i++){
        result = result == operators[i]? 0:1;
    }
    return result;
}
function RandomKey(size){
    var randomKey = '';
    for(var i=0; i<size; i++){
        randomKey += Math.floor(Math.random()*10%2);
    }
    return randomKey;
}

function GenerateVectors(seed){
    lfsr=[];
    var seedsName = ['LFSR-1', 'LFSR-2', 'LFSR-3'];
    for(var i=0; i< seedsName.length; i++) {
        var vector=[];
        var array=[]
        vectorSelectors[i].each(function(){
            vector.push($(this));
        });

        for(var j=0; j<seed[seedsName[i]].length; j++){
            var value = seed[seedsName[i]][j];
            var index = seed[seedsName[i]].length-j-1;
            var tmp= `<span class='value'>${value}</span>
                    <span class='index'>${index}</span>`;
            vector[j].html(tmp);
            array.unshift(parseInt(value) );
        }
        lfsr.push(array);
    }
}
