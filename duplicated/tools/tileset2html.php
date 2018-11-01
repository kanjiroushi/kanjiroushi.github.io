<?php
$width=128;
$height=64;


for($y=0;$y<4;$y++) {
	for($x=0;$x<8;$x++) {
		echo '<div class="tile tile'.$x.'_'.$y.'" x="'.$x.'" y="'.$y.'" title="'.$x.'_'.$y.'"></div>'."\n";
	}
}

echo '<div class="break"></div>'."\n";
for($y=7;$y>=4;$y--) {
	for($x=0;$x<8;$x++) {
		echo '<div class="tile tile'.$x.'_'.$y.'" x="'.$x.'" y="'.$y.'" title="'.$x.'_'.$y.'"></div>'."\n";
	}
}

for($x=0;$x<8;$x++) {
	for($y=0;$y<8;$y++) echo '.tile'.$x.'_'.$y.'{background-position:-'.number_format($x*16,0).'px -'.number_format($y*16,0).'px;}'."\n";
}
