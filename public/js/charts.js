var onSuccess = function(x, y) {
    var r = new Raphael(document.getElementById('canvas_container'), 800, 500);
    var fin = function () {
        console.log(this);
        this.flag = r.g.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
    }
    var fout = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    }
    r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    r.g.text(160, 10, "Bar Chart: Number of Donors every $100");
    r.g.text(480, 10, "Multiline Series Stacked Chart: Number on Amount");
    r.g.text(160, 250, "Simple Line Chart");
    r.g.text(480, 250, "Pie Chart");
    r.g.barchart(10, 20, 300, 220, [y]).hover(fin, fout);
    r.g.hbarchart(330, 20, 300, 220, [x, y], {stacked: true})
      .hover(fin, fout);
    r.g.linechart(10, 270, 300, 220, x, y);
    var pie = r.g.piechart(500, 370, 100, y, {legend: [], legendpos: "west", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});
    pie.hover(function () {
        this.sector.stop();
        this.sector.scale(1.1, 1.1, this.cx, this.cy);
        if (this.label) {
            this.label[0].stop();
            this.label[0].scale(1.5);
            this.label[1].attr({"font-weight": 800});
        }
    }, function () {
        this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
        if (this.label) {
            this.label[0].animate({scale: 1}, 500, "bounce");
            this.label[1].attr({"font-weight": 400});
        }
    });
}

var getDonationsData = function(){
  var bars1, bars2;
  var jqxhr = $.getJSON("/other/donations", function(data) {
    x = data.x;
    y = data.y;
    onSuccess(x, y);
  })
  .error(function() { alert("error"); })
}

$(function() {
  getDonationsData();
});

