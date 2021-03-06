'use strict';
var unit_len = 50;

var data_all = [
    [
        '1 9 5',
        '1 0 1 1 1 0 1 1 0 1 0 1 1 0 1 1 1 0 0 0 0 0 1 0 0 1 0 1 0 1 0 1 0 1 0 1'
    ].join(' '),
    [
        '10 10 6',
        '1 1 1 0 0 1 0 0 0 0 0 1 1 0 1 0 0 1 1 0 1 1 0 1 0 1 1 1 0 0 0 0 1 1 1 0 0 0 0 1 0 0 1 1 0'
    ].join(' '),
	[
		'20 12 6',
		'1 0 1 0 0 0 1 0 0 0 1 0 0 0 0 0 1 0 1 1 0 0 1 0 1 1 1 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 1 0 1 0 0 0 0 0 0 0 1 1 0 1'
	].join(' '),
	[
		'50 13 7',
		'1 0 1 0 0 1 0 0 0 1 1 1 0 0 0 0 1 0 1 0 1 0 1 1 1 0 0 1 1 0 0 0 0 0 0 1 0 0 1 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 1 0 0 0 1 0 0 0 0 1 0 1 0 0 0 0 0 0 1 0 0 0 0 0'
	].join(' ')
]

var Square = function (edge) {
    this.edge = edge;
    this.clicked = false;
    this.sp = null;
    this.dataNum = 0;
    var ac = ((1+(edge-1))*(edge-1))/2;
    this.data = new Array(ac);
    this.index = new Array(this.edge);
    for(var i=0;i<ac;i+=1) {
        this.data[i] = false;
    }
    /*for(i=0;i<this.edge;++i) {
        this.index[i] = i;
    }*/
};

Square.prototype.getPair = function (a, b) {
    if(a == b)
        return false;
    var c = this.index[a][0];
    var r = this.index[b][0];
    if (c > r) {
        var t = c;
        c = r;
        r = t;
    }
    var p = ((r-1)*r)/2+c;
    return this.data[p];
};

Square.prototype.setPair = function(a, b, bl) {
    if(a == b)
        return;
    var c = this.index[a][0];
    var r = this.index[b][0];
    if (c > r) {
        var t = c;
        c = r;
        r = t;
    }
    var p = ((r-1)*r)/2+c;
    this.data[p] = bl;
}

Square.prototype.swapIndex = function (a, b) {
    if(a >= this.edge || b >= this.edge) {
        return;
    }
    var t = this.index[a];
    this.index[a] = this.index[b];
    this.index[b] = t;
};

Square.prototype.render = function (canvas) {
    var lst = unit_len * this.edge;
    canvas.width = lst;
    canvas.height = lst + unit_len;
    var cont = canvas.getContext("2d");
    cont.fillStyle = "#000000";
    cont.fillRect(0,0,lst,lst);
    if(this.onPoint != null) {
        cont.fillStyle = "#003f00";
        cont.fillRect(this.onPoint.x * unit_len, 0, unit_len, unit_len * (this.onPoint.x));
        cont.fillRect(this.onPoint.x * unit_len, unit_len * (this.onPoint.x + 1), unit_len, unit_len * (this.edge - this.onPoint.x-1));
        cont.fillStyle = "#00003f";
        cont.fillRect(0, this.onPoint.x * unit_len, unit_len * this.onPoint.x, unit_len);
        cont.fillRect(unit_len * (this.onPoint.x + 1), this.onPoint.x * unit_len, unit_len * (this.edge - this.onPoint.x), unit_len);
    }
    if(this.sp != null) {
        cont.fillStyle = "#005f00";
        cont.fillRect(this.sp.x * unit_len, 0, unit_len, unit_len * (this.sp.x));
        cont.fillRect(this.sp.x * unit_len, unit_len * (this.sp.x + 1), unit_len, unit_len * (this.edge - this.sp.x -1));
        cont.fillStyle = "#00005f";
        cont.fillRect(0, this.sp.x * unit_len, unit_len * this.sp.x, unit_len);
        cont.fillRect(unit_len * (this.sp.x + 1), this.sp.x * unit_len, unit_len * (this.edge - this.sp.x), unit_len);
    }
    cont.font = "20px Arial";
    for(var c = 0, cc = 0; c < this.edge; c+=1, cc += unit_len) {
        cont.fillStyle = "#ffffff";
        for(var r = 0, rr = 0; r < this.edge; r+=1, rr += unit_len ) {
            if(this.getPair(r,c) == true) {
                cont.fillRect(rr,cc,unit_len,unit_len);
            }
        }
        cont.fillStyle = "#ff0000";
        cont.fillText(this.index[c][1],c*unit_len+unit_len/2,lst+unit_len/2);
    }
    cont.strokeStyle = "#ffaaaa";
    cont.lineWidth=1;
    cont.beginPath();
    for(var c = 0, cc = 0; c < this.edge; c+=1, cc += unit_len) {
        cont.moveTo(cc,0);
        cont.lineTo(cc,lst);
        cont.moveTo(0,cc);
        cont.lineTo(lst,cc);
    }
    cont.stroke();
};

Square.prototype.click = function (x, y) {
    if(this.clicked == false) {
        this.sp = Object();
        this.sp.x = Math.floor(x / unit_len);
        this.sp.y = Math.floor(y / unit_len);
        this.clicked = true;
    }
    else if(this.clicked == true) {
        x = Math.floor(x / unit_len);
        y = Math.floor(y / unit_len);
        this.swapIndex(x,this.sp.x);
        this.sp = null;
        this.clicked = false;
    }
}

Square.prototype.setData = function (n) {
    var d = data_all[n-1];
    if(d == null)
        return;
    else {
        this.dataNum = n;
        var list = d.split(' ');
        this.edge = parseInt(list[1]);
        var ac = ((1+(this.edge-1))*(this.edge-1))/2;
        this.data = new Array(ac);
        for(var i = 0; i < list.length-3; i += 1) {
            this.data[i] = (list[3+i] == "1");
        }
        this.index = new Array(this.edge);
        for(var i = 0; i < this.edge; i += 1) {
			var rs = 0;
			for(var j = 0; j < this.edge; j+=1) {
                if(i == j)
                    continue;
                var c = i;
                var r = j;
                if (c > r) {
                    var t = c;
                    c = r;
                    r = t;
                }
                var p = ((r-1)*r)/2+c;
                if(this.data[p])
                    rs++;
			}
            this.index[i] = [i,rs];
        }
    }
}

Square.prototype.mouseMove = function(x, y) {
    this.onPoint = Object();
    this.onPoint.x = Math.floor(x / unit_len);
    this.onPoint.y = Math.floor(y / unit_len);
}

Square.prototype.mouseOut = function(e) {
    this.onPoint = null;
}
Square.prototype.getDataNum = function() {
    return this.dataNum;
}
