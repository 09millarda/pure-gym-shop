using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PureGym.Store.Data;
using PureGym.Store.Web.Helpers;
using PureGym.Store.Web.Models;

namespace PureGym.Store.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubsetsController : ControllerBase
    {
        private readonly ISubsetRepository _subsetRepository;

        public SubsetsController(ISubsetRepository subsetRepository)
        {
            _subsetRepository = subsetRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var subsets = await _subsetRepository.GetAllGroups().ConfigureAwait(false);
            return Ok(subsets);
        }

        [HttpGet("{subsetId}")]
        public async Task<IActionResult> GetById(int id)
        {
            var subset = await _subsetRepository.GetById(id).ConfigureAwait(false);
            if (subset == null) return NotFound($"No Subset with Id '{id}' exists");

            return Ok(subset);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody]SubsetGroupPostModel subsetGroupForm)
        {
            if (await _subsetRepository.GetByName(subsetGroupForm.Name).ConfigureAwait(false) != null)
                return BadRequest($"Subset with Name '{subsetGroupForm.Name}' already exists");
            var subsetGroup = await _subsetRepository.Create(new SubsetGroup
            {
                Name = subsetGroupForm.Name,
                Items = subsetGroupForm.ItemIds.Select(i => new Item
                {
                    ItemId = i
                }).ToList()
            }).ConfigureAwait(false);

            var createdAtUri = HttpContext.Request.CreateCreatedUri($"api/subsets/{subsetGroup.SubsetId}");
            return Created(createdAtUri, subsetGroup);
        }

        [HttpPut("{subsetId}")]
        public async Task<IActionResult> Update([FromBody]SubsetGroupPostModel subsetGroupForm, int subsetId)
        {
            var subsetGroup = await _subsetRepository.GetByName(subsetGroupForm.Name).ConfigureAwait(false);
            if (subsetGroup != null && subsetGroup.SubsetId != subsetId)
                return BadRequest($"Subset with Name '{subsetGroupForm.Name}' already exists");

            subsetGroup = await _subsetRepository.GetById(subsetId).ConfigureAwait(false);
            if (subsetGroup == null) return NotFound($"No Subset with Id '{subsetId}' exists");

            subsetGroup = await _subsetRepository.Update(new SubsetGroup
            {
                SubsetId = subsetId,
                Name = subsetGroupForm.Name,
                Items = subsetGroupForm.ItemIds.Select(i => new Item
                {
                    ItemId = i
                }).ToList()
            }).ConfigureAwait(false);

            return Ok(subsetGroup);
        }

        [HttpDelete("{subsetId}")]
        public async Task<IActionResult> Delete(int subsetId)
        {
            var subsetGroup = await _subsetRepository.GetById(subsetId).ConfigureAwait(false);
            if (subsetGroup == null) return NotFound($"No Subset with Id '{subsetId}' found");

            await _subsetRepository.Delete(subsetId).ConfigureAwait(false);
            return Ok();
        }
    }
}