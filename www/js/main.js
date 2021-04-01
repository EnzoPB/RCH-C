const {
	ipcRenderer,
	remote
} = require('electron');

function openModal(modalSelector) {
	var modal = $(modalSelector);

	modal.addClass('visible');

	$(modalSelector + ' .close').one('click', () => {
		modal.removeClass('visible');
	});
}