from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests


class ActionHelloWorld(Action):

    def name(self) -> Text:
        return "action_hello_world"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Hello World!")

        return []

class ActionRecommendedToys(Action):

    def name(self) -> Text:
        return "action_recommended_toys"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/toy'
        res = requests.get(url)
        toys = res.json()

        if len(toys) >= 3:
            bot_response = {
                "type": "toy_list",
                "data": toys[-3:]
            }

            dispatcher.utter_message(
            text='Here are some toys:', 
            attachment= bot_response
        )
        else:
            dispatcher.utter_message(text='Not enough toys found')

        return []
    
class ActionSearchToys(Action):

    def name(self) -> Text:
        return "action_search_toys"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
            
        criteria = tracker.get_slot("search_criteria")

        if not criteria:
            dispatcher.utter_message("I didnt catch what toy to search for. Try again")
            return []

        url = 'https://toy.pequla.com/api/toy'
        res = requests.get(url)
        toys = res.json()
         

        matching_toys = [
            {
                "toyId": toy["toyId"],
                "name": toy["name"],
                "permalink": toy["permalink"],
                "description": toy["description"],
                "price": toy["price"],
                "imageUrl": toy["imageUrl"],
                "ageGroup": toy["ageGroup"],
                "type": toy["type"]
            }
            for toy in toys
            if criteria.lower() in toy["name"].lower()
        ]

        if matching_toys:
            dispatcher.utter_message(
                text=f"Here are the search results for '{criteria}':",
                attachment={
                    "type": "toy_list",
                    "data": matching_toys
                }
            )
        else:
            dispatcher.utter_message(text=f"Sorry, no toys found matching '{criteria}'.")

        return []
    

class ActionToyTypes(Action):

    def name(self) -> Text:
        return "action_toy_types"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/type'
        res = requests.get(url)


        dispatcher.utter_message(
            text= 'Here are the available types:',
            attachment={
                "type": "type_list",
                "data": res.json()
            }
        )

        return []


class ActionOrderMovie(Action):

    def name(self) -> Text:
        return "action_toy_types"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        url = 'https://toy.pequla.com/api/type'
        res = requests.get(url)


        dispatcher.utter_message(
            text= 'Here are the available types:',
            attachment={
                "type": "type_list",
                "data": res.json()
            }
        )

        return []