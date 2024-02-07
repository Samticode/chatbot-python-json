import random


def random_string():
    random_list = [
        '<p>Jeg er ikke sikker på hva du mener.</p>',
        '<p>Kan du utdype?</p>',
        '<p>Kan du si det på en annen måte?</p>',
        '<p>Ta kontakt med url for å få svar.</p>'
    ]

    list_count = len(random_list)
    random_item = random.randrange(list_count)

    return random_list[random_item]