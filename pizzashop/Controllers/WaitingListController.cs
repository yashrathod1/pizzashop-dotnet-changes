using Microsoft.AspNetCore.Mvc;
using pizzashop_repository.ViewModels;
using pizzashop_service.Interface;

namespace pizzashop.Controllers;

public class WaitingListController : Controller
{
    private readonly IWaitingListService _waitingListService;

    public WaitingListController(IWaitingListService waitingListService)
    {
        _waitingListService = waitingListService;
    }

    public async Task<IActionResult> Index()
    {
        WaitingListViewModel? section = await _waitingListService.GetSectionAsync();
        ViewBag.ActiveNav = "WaitingList";
        return View(section);
    }

    [HttpGet]
    public async Task<IActionResult> GetSections()
    {
        var sections = await _waitingListService.GetAllSectionsAsync();
        return Json(sections);
    }

    public async Task<IActionResult> GetWaitingListBySection(int? sectionId)
    {
        WaitingListViewModel? model = await _waitingListService.GetWaitingListAsync(sectionId);
        return PartialView("_WaitingListPartial", model.WaitingList);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWaitingToken(WaitingTokenViewModel waitingTokenVm)
    {
        if (waitingTokenVm == null)
        {
            return Json("Invalid data.");
        }

        bool result = await _waitingListService.AddWaitingTokenInWaitingListAsync(waitingTokenVm);

        if (result)
        {
            return Json(new { message = "Waiting token added successfully!" });
        }
        else
        {
            return Json(new { message = "Waiting token already exits" });
        }

    }

    public async Task<IActionResult> GetCustomerByEmail(string email)
    {
        var customer = await _waitingListService.GetCustomerByEmail(email);
        return Json(customer);
    }

    [HttpGet]
    public async Task<IActionResult> GetTokenById(int id)
    {
        var model = await _waitingListService.GetTokenByIdAsync(id);
        if (model != null)
        {
            return Json(model);
        }
        return Json(null);
    }
}
