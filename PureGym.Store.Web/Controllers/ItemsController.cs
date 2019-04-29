using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PureGym.Store.Data;
using System.Web;
using PureGym.Store.Web.Helpers;

namespace PureGym.Store.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IItemsRepository _itemsRepository;
        private readonly IStorageRepository _storageRepository;
        private readonly ISubsetRepository _subsetRepository;

        public ItemsController(IItemsRepository itemsRepository, IStorageRepository storageRepository, ISubsetRepository subsetRepository)
        {
            _storageRepository = storageRepository;
            _subsetRepository = subsetRepository;
            _itemsRepository = itemsRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _itemsRepository.GetAll().ConfigureAwait(false);

            return Ok(items);
        }

        [HttpGet("{itemId}")]
        public async Task<IActionResult> GetById(int itemId)
        {
            var item = await _itemsRepository.GetById(itemId).ConfigureAwait(false);

            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpGet("byIds")]
        public async Task<IActionResult> GetByIds(string csvItemIds)
        {
            if (csvItemIds == null) return Ok(new object[] { });
            var ids = csvItemIds.Split(",").Select(i => int.Parse(i));
            var items = await _itemsRepository.GetByIds(ids).ConfigureAwait(false);

            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody]Item itemForm)
        {
            if (await _itemsRepository.GetByName(itemForm.Name).ConfigureAwait(false) != null)
                return BadRequest($"An item with Name '{itemForm.Name}' already exists");

            var imageUri = await _storageRepository.UploadImageBlob(itemForm.ImageUri).ConfigureAwait(false);
            itemForm.ImageUri = imageUri;

            var item = await _itemsRepository.Create(itemForm).ConfigureAwait(false);
            var createdAtUri = HttpContext.Request.CreateCreatedUri($"api/items/{item.ItemId}");
            return Created(createdAtUri, item);
        }

        [HttpPut("{itemId}")]
        public async Task<IActionResult> Update([FromBody]Item itemForm, int itemId)
        {
            var sqlItem = await _itemsRepository.GetById(itemId).ConfigureAwait(false);
            if (sqlItem == null)
                return NotFound();

            if (itemForm.Name != sqlItem.Name &&
                await _itemsRepository.GetByName(itemForm.Name).ConfigureAwait(false) != null)
            {
                return BadRequest($"Item with name '{itemForm.Name}' already exists");
            }

            if (itemForm.ImageUri != sqlItem.ImageUri)
                itemForm.ImageUri = await _storageRepository.UploadImageBlob(itemForm.ImageUri).ConfigureAwait(false);

            itemForm.ItemId = itemId;
            var item = await _itemsRepository.Update(itemForm).ConfigureAwait(false);

            return Ok(item);
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> Delete(int itemId)
        {
            var item = await _itemsRepository.GetById(itemId).ConfigureAwait(false);
            if (item == null) return NotFound($"No item found with Id '{itemId}'");

            await _subsetRepository.DeleteByItemId(itemId).ConfigureAwait(false);
            await _itemsRepository.DeleteById(itemId).ConfigureAwait(false);
            return Ok();
        }
    }
}