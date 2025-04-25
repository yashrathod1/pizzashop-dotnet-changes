
$(document).ready(function () {

    $('#WaitingToken').on('hidden.bs.modal', function () {
        $(this).find('input[type="text"], input[type="email"], input[type="hidden"], textarea').val('');
        $(this).find('span.text-danger').text('');
    });

    loadWaitingList(null);

    $(".nav-link").on("click", function () {
        const sectionId = $(this).data("id");
        loadWaitingList(sectionId);
    });

});

function loadWaitingList(sectionId) {
    const containerId = sectionId ? `#waitingListContainer-${sectionId}` : "#waitingListContainer";

    $.ajax({
        url: '/WaitingList/GetWaitingListBySection',
        type: 'GET',
        data: { sectionId: sectionId },
        success: function (html) {
            $(containerId).html(html);
        },
        error: function () {
            $(containerId).html('<p class="text-danger">Failed to load waiting list.</p>');
        }
    });
}

// get customer by email
$(document).on('blur', '#customerEmail', function () {
    var email = $(this).val();
    if (email) {
        $.ajax({
            url: '/WaitingList/GetCustomerByEmail',
            type: 'GET',
            data: { email: email },
            success: function (data) {
                if (data) {
                    $('#customerName').val(data.name);
                    $('#customerMobile').val(data.mobileNo);
                    $('#customerTokenId').val(data.id);
                    toastr.success("Customer Details Loaded Successfull");
                } else {
                    $('#customerName, #customerMobile, #totalPerson').val('');

                }
            }
        });
    }
});

$(document).on("submit", "#AddWaitingTokenTable", function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        return false;
    }

    var formData = new FormData(this);

    $.ajax({
        url: '/WaitingList/CreateWaitingToken',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                $('#WaitingToken').modal('hide');
                $('#AddWaitingTokenTable')[0].reset();
                toastr.success(response.message);

                var sectionId = $("#WaititngTokensectionId").data("id");
                console.log("dfh", sectionId)

                $(`.nav-link[data-id="${sectionId}"]`).click();
            } else {
                toastr.error(response.message);
            }

        },
        error: function (error) {
            toastr.error(error.message);
        }
    });
});

// dropdown in add waiting token the modal

$(document).on("click", ".wait-token-btn", function () {

    var sectionId = $(".nav-tabs .nav-link.active").data("id");

    $.ajax({
        url: '/WaitingList/GetSections',
        type: 'GET',
        success: function (sections) {
            var $dropdown = $("#WaititngTokensectionId");
            $dropdown.empty();
            $.each(sections, function (i, section) {
                var isSelected = section.id === sectionId;
                $dropdown.append($('<option>', {
                    value: section.id,
                    text: section.name,
                    selected: isSelected
                }));
            });
            
            $("#selectedSectionId").val(sectionId)
        },
        error: function () {
            alert('Failed to load sections.');
        }
    });
});

// dropdown in the edit waiting token modal
$(document).on("click", ".edit-waiting-token", function () {

    var sectionId = $(".nav-tabs .nav-link.active").data("id");

    $.ajax({
        url: '/WaitingList/GetSections',
        type: 'GET',
        success: function (sections) {
            var $dropdown = $("#WaititngTokensectionId");
            $dropdown.empty();
            $.each(sections, function (i, section) {
                var isSelected = section.id === sectionId;
                $dropdown.append($('<option>', {
                    value: section.id,
                    text: section.name,
                    selected: isSelected
                }));
            });
            
            $("#selectedSectionId").val(sectionId)
        },
        error: function () {
            alert('Failed to load sections.');
        }
    });
});

// get detail on click pencil

$(document).on("click", ".edit-waiting-token", function () {
    var tokenId = $(this).data("id");

    $.ajax({
        url: '/WaitingList/GetTokenById',
        type: 'GET',
        data: { id: tokenId },
        success: function (data) {
            if (data) {
                console.log("section datais", data);
                $('#editTokenId').val(data.id);
                $('#customerName').val(data.name);
                $('#customerEmail').val(data.email);
                $('#customerMobile').val(data.phoneNumber);
                $('#nop').val(data.noOfPerson);
                $('#WaititngTokensectionId').val(data.sectionId);
                // Show modal
                $('#WaitingToken').modal('show');
            } else {
                toastr.error("Token not found.");
            }
        },
        error: function () {
            toastr.error("Error fetching token.");
        }
    });
});

// edit waiting token

$(document).on("submit", ".edit-waiting-token", function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        return;
    }

    var formData = new FormData(this);

    $.ajax({
        url: "/WaitingList/UpdateModifierGroup",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
    
            } else {
                toastr.error(response.message);
            }
        },
        error: function () {
            toastr.error("Error updating modifier group.");
        }
    });
});