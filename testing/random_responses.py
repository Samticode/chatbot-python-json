import random


def random_string():
    random_list = [
        '<p>I am not sure what you are trying to say.</p>',
        '<p>Can you say it in another way.</p>',
        '<p>Get in contact with us on <a href="https://www.nordicneurolab.com/support">NordicNeuroLab.con</a></p>'
    ]

    list_count = len(random_list)
    random_item = random.randrange(list_count)

    return random_list[random_item]