var onSuccess = function(bars1, bars2) {
    var r = new Raphael(document.getElementById('canvas_container'), 800, 300);
    var fin = function () {
        console.log(this);
        this.flag = r.g.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
    }
    var fout = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    }
    r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
    r.g.text(160, 10, "Single Series Chart");
    r.g.text(480, 10, "Multiline Series Stacked Chart");
    // var bars1 =  [55, 20, 13, 32, 5, 1, 2, 10];
    // var bars2 = [10, 2, 1, 5, 32, 13, 20, 55];
    r.g.barchart(10, 20, 300, 220, [bars1]).hover(fin, fout);
    r.g.hbarchart(330, 20, 300, 220, [bars1, bars2], {stacked: true})
      .hover(fin, fout);
}

$(function() {
  var bars1, bars2;
  var jqxhr = $.getJSON("example.json", function(data) {
    bars1 = data.bars1;
    bars2 = data.bars2;
    onSuccess(bars1, bars2);
  })
  .error(function() { alert("error"); })
});
