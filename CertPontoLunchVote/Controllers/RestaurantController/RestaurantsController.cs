using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CertPontoLunchVote.Data;
using CertPontoLunchVote.Domain.Entities;

namespace CertPontoLunchVote.Controllers.RestaurantController
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RestaurantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Restaurants

        private bool _isMostVotedResetted;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants()
        {
            var test = User.Claims;
            if (_context.Restaurants == null)
            {
                return NotFound();
            }

            // verifica se o IsMostVoted já foi resetado
            if (!_isMostVotedResetted)
            {
                // verifica se é segunda-feira
                var now = DateTime.Now;
                if (now.DayOfWeek == DayOfWeek.Monday)
                {
                    // redefine o IsMostVoted de todos os restaurantes para false
                    foreach (var restaurant in _context.Restaurants)
                    {
                        restaurant.IsMostVoted = false;
                    }

                    // salva as alterações no banco de dados
                    await _context.SaveChangesAsync();

                    // sinaliza que o IsMostVoted já foi resetado
                    _isMostVotedResetted = true;
                }
            }

            // retorna a lista de restaurantes
            return await _context.Restaurants
              .Where(r => r.IsActive == true && r.IsMostVoted == false)
              .ToListAsync();
        }

        // GET: api/Restaurants/MostVotedOfDay
        [HttpGet("MostVotedOfDay")]
        public async Task<IActionResult> GetMostVotedRestaurantOfDay()
        {
            // Obtém a data atual
            var today = DateTime.Today;

            // Busca todos os votos feitos no dia atual
            var votesOfDay = await _context.Votes
                .Where(v => v.VoteDate.Date == today)
                .ToListAsync();

            // Agrupa os votos por RestaurantId e conta a quantidade de votos para cada restaurante
            var restaurantVoteCounts = votesOfDay
                .GroupBy(v => v.RestaurantId)
                .Select(group => new
                {
                    RestaurantId = group.Key,
                    VoteCount = group.Count()
                })
                .ToList();

            // Encontra o restaurante mais votado do dia (com base no VoteCount)
            var mostVotedRestaurant = restaurantVoteCounts
                .OrderByDescending(r => r.VoteCount)
                .FirstOrDefault();
            var id = User.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            if (mostVotedRestaurant == null)
            {
                return NotFound();
            }

            // Encontra o restaurante correspondente no banco de dados
            var restaurant = await _context.Restaurants.FindAsync(mostVotedRestaurant.RestaurantId);

            if (restaurant == null)
            {
                return NotFound();
            }

            // Define o IsMostVoted do restaurante mais votado como true
            restaurant.IsMostVoted = true;

            // Salva as alterações no banco de dados
            await _context.SaveChangesAsync();

            // Retorna o restaurante mais votado do dia
            return Ok(restaurant);
        }

        // PUT: api/Restaurants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRestaurant(int id, Restaurant restaurant)
        {
            if (id != restaurant.Id)
            {
                return BadRequest();
            }

            _context.Entry(restaurant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RestaurantExists(id))
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

        // POST: api/Restaurants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Restaurant>> PostRestaurant(Restaurant restaurant)
        {
            if (_context.Restaurants == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Restaurants'  is null.");
            }
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRestaurant", new { id = restaurant.Id }, restaurant);
        }

        // DELETE: api/Restaurants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            if (_context.Restaurants == null)
            {
                return NotFound();
            }
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RestaurantExists(int id)
        {
            return (_context.Restaurants?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
