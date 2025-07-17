import requests

offense_chart = {
    'normal': {'rock': 0.5, 'ghost': 0, 'steel': 0.5},
    'fire': {'fire': 0.5, 'water': 0.5, 'grass': 2, 'ice': 2, 'bug': 2, 'rock': 0.5, 'dragon': 0.5, 'steel': 2},
    'water': {'fire': 2, 'water': 0.5, 'grass': 0.5, 'ground': 2, 'rock': 2, 'dragon': 0.5},
    'electric': {'water': 2, 'electric': 0.5, 'grass': 0.5, 'ground': 0, 'flying': 2, 'dragon': 0.5},
    'grass': {'fire': 0.5, 'water': 2, 'grass': 0.5, 'poison': 0.5, 'ground': 2, 'flying': 0.5, 'bug': 0.5, 'rock': 2, 'dragon': 0.5, 'steel': 0.5},
    'ice': {'fire': 0.5, 'water': 0.5, 'grass': 2, 'ice': 0.5, 'ground': 2, 'flying': 2, 'dragon': 2, 'steel': 0.5},
    'fighting': {'normal': 2, 'ice': 2, 'poison': 0.5, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'rock': 2, 'ghost': 0, 'dark': 2, 'steel': 2, 'fairy': 0.5},
    'poison': {'grass': 2, 'poison': 0.5, 'ground': 0.5, 'rock': 0.5, 'ghost': 0.5, 'steel': 0, 'fairy': 2},
    'ground': {'fire': 2, 'electric': 2, 'grass': 0.5, 'poison': 2, 'flying': 0, 'bug': 0.5, 'rock': 2, 'steel': 2},
    'flying': {'electric': 0.5, 'grass': 2, 'fighting': 2, 'bug': 2, 'rock': 0.5, 'steel': 0.5},
    'psychic': {'fighting': 2, 'poison': 2, 'psychic': 0.5, 'dark': 0, 'steel': 0.5},
    'bug': {'fire': 0.5, 'grass': 2, 'fighting': 0.5, 'poison': 0.5, 'flying': 0.5, 'psychic': 2, 'ghost': 0.5, 'dark': 2, 'steel': 0.5, 'fairy': 0.5},
    'rock': {'fire': 2, 'ice': 2, 'fighting': 0.5, 'ground': 0.5, 'flying': 2, 'bug': 2, 'steel': 0.5},
    'ghost': {'normal': 0, 'psychic': 2, 'ghost': 2, 'dark': 0.5},
    'dragon': {'dragon': 2, 'steel': 0.5, 'fairy': 0},
    'dark': {'fighting': 0.5, 'psychic': 2, 'ghost': 2, 'dark': 0.5, 'fairy': 0.5},
    'steel': {'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'ice': 2, 'rock': 2, 'fairy': 2, 'steel': 0.5},
    'fairy': {'fire': 0.5, 'fighting': 2, 'poison': 0.5, 'dragon': 2, 'dark': 2, 'steel': 0.5},
}

# Defensive chart (same as before)
defense_chart = {
    'normal': {'fighting': 2, 'ghost': 0},
    'fire': {'water': 2, 'ground': 2, 'rock': 2, 'fire': 0.5, 'grass': 0.5, 'ice': 0.5, 'bug': 0.5, 'steel': 0.5, 'fairy': 0.5},
    'water': {'electric': 2, 'grass': 2, 'fire': 0.5, 'water': 0.5, 'ice': 0.5, 'steel': 0.5},
    'electric': {'ground': 2, 'electric': 0.5, 'flying': 0.5, 'steel': 0.5},
    'grass': {'fire': 2, 'ice': 2, 'poison': 2, 'flying': 2, 'bug': 2, 'water': 0.5, 'electric': 0.5, 'grass': 0.5, 'ground': 0.5},
    'ice': {'fire': 2, 'fighting': 2, 'rock': 2, 'steel': 2, 'ice': 0.5},
    'fighting': {'flying': 2, 'psychic': 2, 'fairy': 2, 'bug': 0.5, 'rock': 0.5, 'dark': 0.5},
    'poison': {'ground': 2, 'psychic': 2, 'fighting': 0.5, 'poison': 0.5, 'bug': 0.5, 'grass': 0.5, 'fairy': 0.5},
    'ground': {'water': 2, 'grass': 2, 'ice': 2, 'poison': 0.5, 'rock': 0.5},
    'flying': {'electric': 2, 'ice': 2, 'rock': 2, 'grass': 0.5, 'fighting': 0.5, 'bug': 0.5, 'ground': 0},
    'psychic': {'bug': 2, 'ghost': 2, 'dark': 2, 'fighting': 0.5, 'psychic': 0.5},
    'bug': {'fire': 2, 'flying': 2, 'rock': 2, 'fighting': 0.5, 'grass': 0.5, 'ground': 0.5},
    'rock': {'water': 2, 'grass': 2, 'fighting': 2, 'ground': 2, 'steel': 2, 'normal': 0.5, 'fire': 0.5, 'poison': 0.5, 'flying': 0.5},
    'ghost': {'ghost': 2, 'dark': 2, 'poison': 0.5, 'bug': 0.5, 'normal': 0, 'fighting': 0},
    'dragon': {'ice': 2, 'dragon': 2, 'fairy': 2, 'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'grass': 0.5},
    'dark': {'fighting': 2, 'bug': 2, 'fairy': 2, 'ghost': 0.5, 'dark': 0.5},
    'steel': {'fire': 2, 'fighting': 2, 'ground': 2, 'normal': 0.5, 'grass': 0.5, 'ice': 0.5, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'rock': 0.5, 'dragon': 0.5, 'steel': 0.5, 'fairy': 0.5, 'poison': 0},
    'fairy': {'poison': 2, 'steel': 2, 'fighting': 0.5, 'bug': 0.5, 'dark': 0.5, 'dragon': 0},
}

def calc_multiplier(attack_type, defending_types):
    multiplier = 1
    for d_type in defending_types:
        multiplier *= offense_chart.get(attack_type, {}).get(d_type, 1)
    return multiplier

def rate(team_in):
    coverage_scores = {type_name: 0 for type_name in offense_chart.keys()}
    defense_scores = {type_name: 0 for type_name in defense_chart.keys()}
    mid_pokemon = []

    def get_pokemon_data(pokemon_name):
        response = requests.get(f'https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}')
        return response.json() if response.status_code == 200 else None

    for pokemon in team_in:
        data = get_pokemon_data(pokemon)
        if data:
            name = data['name']
            types = [t['type']['name'] for t in data['types']]
            stats = [t['base_stat'] for t in data['stats']]

            base_stat_total = sum(stats)
            
            if base_stat_total<430:
                mid_pokemon.append(name)
            elif base_stat_total<465:
                mid_pokemon.append(name)
                for stat in stats:
                    if stat>=110:
                        if name in mid_pokemon:
                            mid_pokemon.remove(name)
                
                


            print(f'{name.upper()}, types: {types}, stats: {stats}')

            # Offensive coverage
            for type_ in types:
                for defending_type in offense_chart:
                    multiplier = calc_multiplier(type_, [defending_type])
                    coverage_scores[defending_type] += multiplier

            # Defensive coverage
            for attacking_type in defense_chart:
                multiplier = 1
                for defense_type in types:
                    multiplier *= defense_chart.get(defense_type, {}).get(attacking_type, 1)
                defense_scores[attacking_type] += multiplier


    offensive_weaknesses = []
    defensive_weaknesses = []
    stat_weak_pokemon = []

    #---Offensively weak against---
    for defending_type, score in sorted(coverage_scores.items()):
        if score<=3:
            offensive_weaknesses.append({'type': defending_type, 'score': round(score,1)})

    #---Team Defense weaknesses---
    for attacking_type, score in sorted(defense_scores.items()):
        if score>6:
            defensive_weaknesses.append({'type': attacking_type, 'score': round(score,1)})

    #---Statwise Analysis---
    for pokemon in mid_pokemon:
        stat_weak_pokemon.append(pokemon)

    return{
        'offensive_weaknesses': offensive_weaknesses,
        'defensive_weaknesses': defensive_weaknesses,
        'stat_weak_pokemon': stat_weak_pokemon
    }

