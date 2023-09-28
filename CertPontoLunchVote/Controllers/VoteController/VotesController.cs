using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CertPontoLunchVote.Data;
using System.Security.Claims;
using CertPontoLunchVote.Domain.Entities;
using CertPontoLunchVote.Domain.DTO;

namespace CertPontoLunchVote.Controllers.VoteController
{
    [Route("api/[controller]")]
    [ApiController]
    public class VotesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public VotesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Votes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vote>>> GetVotes()
        {
            if (_context.Votes == null)
            {
                return NotFound();
            }
            return await _context.Votes.ToListAsync();
        }

        // GET: api/Votes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vote>> GetVote(int id)
        {
            if (_context.Votes == null)
            {
                return NotFound();
            }
            var vote = await _context.Votes.FindAsync(id);

            if (vote == null)
            {
                return NotFound();
            }

            return vote;
        }

        // PUT: api/Votes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVote(int id, Vote vote)
        {
            if (id != vote.Id)
            {
                return BadRequest();
            }

            _context.Entry(vote).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VoteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Votes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Vote>> PostVote(VotePostDto restaurantName)
        {
            // Obter o ID do usuário autenticado
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Verificar se o usuário está autenticado
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("Usuário não autenticado.");
            }

            // Verificar se o usuário já votou hoje
            var voteDate = DateTime.Today.Date;
            var hasVotedToday = await _context.Votes
                .AnyAsync(v => v.UserId == userId && v.VoteDate.Date == voteDate);

            if (hasVotedToday)
            {
                return Conflict("Você não pode votar novamente hoje.");
            }
            else
            {
                var restaurant = _context.Restaurants.FirstOrDefault(x => x.Name == restaurantName.restaurantName);

                if (restaurant == null)
                {
                    return NotFound("Restaurante não encontrado.");
                }

                // Criação do voto
                var vote = new Vote(userId.ToString(), restaurant.Id);

                // Adicionar o voto ao contexto
                _context.Votes.Add(vote);

                try
                {
                    // Salvar as mudanças no banco de dados
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    // Lidar com erros de exceção de banco de dados, se necessário
                    return StatusCode(StatusCodes.Status500InternalServerError, "Erro interno do servidor.");
                }

                return CreatedAtAction("GetVote", new { id = vote.Id }, vote);
            }


        }

        // DELETE: api/Votes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVote(int id)
        {
            if (_context.Votes == null)
            {
                return NotFound();
            }
            var vote = await _context.Votes.FindAsync(id);
            if (vote == null)
            {
                return NotFound();
            }

            _context.Votes.Remove(vote);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VoteExists(int id)
        {
            return (_context.Votes?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
