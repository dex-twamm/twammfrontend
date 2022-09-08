export default function showDropdown() {
	document.getElementById('menu-dropdown').classList.toggle('show');

	// Close the dropdown if the user clicks outside of it
	window.onclick = function (event) {
		if (!event.target.matches('.menu-three-dot')) {
			var dropdowns = document.getElementsByClassName('menu-list');
			var i;
			for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('show')) {
					openDropdown.classList.remove('show');
				}
			}
		}
	};
}
