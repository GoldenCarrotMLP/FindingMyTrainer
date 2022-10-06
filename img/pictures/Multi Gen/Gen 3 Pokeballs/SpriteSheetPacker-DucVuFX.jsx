/* ************************************************************************ */
/* ************************************************************************ */
//// SPRITE SHEET PACKER PHOTOSHOP SCRIPT
//// Author: Vũ Ngọc Đức - DucVu FX
//// Contact: vungocduchd@gmail.com
//// Youtube: https://www.youtube.com/channel/UC5ZauAWNyh931gRJUqB1QPw
/* ************************************************************************ */
/* ************************************************************************ */

app.bringToFront();
app.preferences.rulerUnits = Units.PIXELS;
var docRef = app.activeDocument;

var fillColor = new SolidColor();
fillColor.rgb.red = 0;
fillColor.rgb.green = 0;
fillColor.rgb.blue = 0;

function collectLayers(doc, collect) {
    
    for (var i = doc.layers.length - 1; i >= 0; i--) 
    {
        var layer = doc.layers[i];
        collect.push(layer);
    }
}

function cal_RowColumn(layersCount)
{
    var row = Math.ceil(Math.sqrt(layersCount));
    var column = Math.ceil(layersCount/row);
    return([row, column]);
}

function showProgressDialog () 
{
	var dialog = new Window("palette", "Packing Layer - Processing...");
	dialog.alignChildren = "fill";
	dialog.orientation = "column";

	var message = dialog.add("statictext", undefined, "Initializing...");

	var group = dialog.add("group");
		var bar = group.add("progressbar");
		bar.preferredSize = [300, 16];
		bar.maxvalue = 10000;
		var cancelButton = group.add("button", undefined, "Cancel");

	cancelButton.onClick = function () {
		cancel = true;
        cancelButton.enabled = false;
        dialog.close();
		return;
	};

	dialog.center();
	dialog.show();
	dialog.active = true;

	progress = {
		dialog: dialog,
		bar: bar,
		message: message
	};
}

function setProgress (percent, layerName) 
{
	progress.bar.value = 10000 * percent;
	progress.message.text = "Layer: " + layerName;
	if (!progress.dialog.active) progress.dialog.active = true;
}

// user interface
var dialog = "dialog{statictext:StaticText{bounds:[40,0,240,25], text:'_DUCVU FX - SPRITE SHEET PACKER_'}}";
var askWindow = new Window (dialog, "Pack Dialog");
var runBtn = askWindow.add('button', undefined, "RUN");
var closeBtn = askWindow.add('button', undefined, "CLOSE");

closeBtn.onClick = function test(){
    askWindow.close();
}

runBtn.onClick = function run(){
    var doc = docRef.duplicate();
    showProgressDialog();
    var count = 0;
    var x = doc.width;
    var y = doc.height;
    var layers = [];
	collectLayers(doc, layers);
    var layersCount = layers.length;
    var row = cal_RowColumn(layersCount)[0];
    var column = cal_RowColumn(layersCount)[1];

    // resize canvas để chứa đủ số hàng và số cột
    doc.resizeCanvas((x * column), (y * row), AnchorPosition.TOPLEFT);
    var move_x = 0;
    var move_y = 0;
    for (var i = 0; i < layersCount; i++) {
        setProgress(++count / layersCount, doc.layers[i].name);
        layers[i].translate(move_x, move_y);
        move_x += x;
        
        if(move_x >= (x * column))
        {
            move_x = 0;
            move_y += y;
        }
    }
    // tạo layer fill màu đen làm background
    var bg = doc.artLayers.add();
    doc.selection.fill(fillColor);
    bg.name = "BG";
    bg.move(doc.layers[doc.layers.length-1],ElementPlacement.PLACEAFTER);

    askWindow.close();
}
askWindow.show();