'use strict'
var
    body = $('body'),
    nextStep = $('button#next-step'),
    vectorSelectors= [
            $('#vector-LFSR-1 .values'),
            $('#vector-LFSR-2 .values'),
            $('#vector-LFSR-3 .values')
        ],
    lfsr = [],
    message,
    newValues = [],
    shiftVector=[],
    method = stepOne,
    count=0;

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

    //reset
    $('#result-message .elements').empty();
    $('#result #cipher-sec .elements').empty();
    count=0;
    lfsr=[];
    method = stepOne;

    GenerateVectors({
        'LFSR-1': $('#LFSR-1').val(),
        'LFSR-2': $('#LFSR-2').val(),
        'LFSR-3': $('#LFSR-3').val()
    });
    message = $('#input-message').val();
    var tmp='';
    for(var i=0; i< message.length; i++){
        tmp +=`<div class="element">${message[i]}</div>`;
    }
    $('#original-message .elements').html(tmp);

    // initialize(10); //modificacion de la practica
});
$('#random-values').on('click',function(){
    $('#LFSR-1').val(RandomKey(19));
    $('#LFSR-2').val(RandomKey(22));
    $('#LFSR-3').val(RandomKey(23));
});

//Modificacion de la practica
function initialize(times){
    for(var i=0; i<times; i++){
        var shift= MajorityFunction([lfsr[0][8], lfsr[1][10], lfsr[2][10]])
        var xorValues= [
            XorOperation([lfsr[0][18],lfsr[0][17],lfsr[0][16],lfsr[0][13]]),
            XorOperation([lfsr[1][21],lfsr[1][20]]),
            XorOperation([lfsr[2][22],lfsr[2][21],lfsr[2][20],lfsr[2][7]])
        ];
        for(var j=0; j<shift.length; j++){
            var index = shift[j];
            lfsr[index].pop();
            lfsr[index].unshift(xorValues[index]);
        }

    }
    for(var i=0; i<lfsr.length; i++){
        var j = lfsr[i].length-1;
        vectorSelectors[i].find('.value').each(function(){
            $(this).text(lfsr[i][j--]);
        });
    }
}
function Shift(op, newValues){
    for(var i=0; i<op.length; i++){
        var index = op[i];
        lfsr[  index].pop()
        lfsr[ index ].unshift(newValues[index]);
        var j= lfsr[index].length -1;


        vectorSelectors[index].find('.value').each(function(){

            $(this).text(lfsr[index][j--]);
        });

    }

}
function CipherOperation(c,m){
    var result = XorOperation([c,m])


    $('#result-message .elements').append(`<div class="element">${result}</div>`);
}
function stepOne(){
    if(count<message.length) {
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
    }else{
        method = function(){
            alert('El mensaje ha sido cifrado.');
        }

        method();
    }
}
function stepTwo(){

        $('#vector-LFSR-1 .value-in').text('');
        $('#vector-LFSR-2 .value-in').text('');
        $('#vector-LFSR-3 .value-in').text('');

        var cipher = XorOperation([lfsr[0][18], lfsr[1][21], lfsr[2][22]]);
        $('#result #cipher-sec .elements').append(`<div class="element"> ${cipher}</div>`);
        CipherOperation(cipher, message[count++]);
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
    var shift=[];
    for(var i=0; i<op.length; i++){
        if(major==op[i]){
            vectorSelectors[i].find('.value').css('color','#FFF');
            shift.push(i);
        }
        else{
            vectorSelectors[i].find('.value').css('color','red');
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
    var seedsName = ['LFSR-1', 'LFSR-2', 'LFSR-3'];
    for(var i=0; i< seedsName.length; i++) {
        var tmp ='';
        var array=[]
        for(var j=0; j<seed[seedsName[i]].length; j++){
            var value = seed[seedsName[i]][j];
            var index = seed[seedsName[i]].length-j-1;
            tmp += `<span class='value'>${value}</span>`;
            array.unshift(parseInt(value) );
        }
        vectorSelectors[i].html(tmp)
        lfsr.push(array);
    }
}
