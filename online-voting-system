from datetime import datetime
import ast
import os

class Candidate:
    def __init__(self, candidate_id, name, position):
        self.candidate_id = candidate_id
        self.name = name
        self.position = position
        self.voters = set()
        self.vote_count = 0

    def to_dict(self):
        return {
            "candidate_id": self.candidate_id,
            "name": self.name,
            "position": self.position,
            "vote_count": self.vote_count,
            "voters": list(self.voters)
        }

    @staticmethod
    def from_dict(data):
        c = Candidate(data["candidate_id"], data["name"], data["position"])
        c.vote_count = data["vote_count"]
        c.voters = set(data["voters"])
        return c

class Voter:
    def __init__(self, voter_id, name):
        self.voter_id = voter_id
        self.name = name
        self.voted_positions = set()

    def to_dict(self):
        return {
            "voter_id": self.voter_id,
            "name": self.name,
            "voted_positions": list(self.voted_positions)
        }

    @staticmethod
    def from_dict(data):
        v = Voter(data["voter_id"], data["name"])
        v.voted_positions = set(data["voted_positions"])
        return v

class VotingSystem:
    def __init__(self):
        self.candidates = {}
        self.voters = {}
        self.voting_history = []
        self.load_data()

    def log_to_file(self, text):
        with open("data.txt", "a") as f:
            f.write(text + "\n")

    def save_object(self, tag, obj_dict):
        with open("data.txt", "a") as f:
            f.write(f"{tag}: {obj_dict}\n")

    def load_data(self):
        if not os.path.exists("data.txt"):
            return
        with open("data.txt", "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("CANDIDATE:"):
                    data = ast.literal_eval(line.split("CANDIDATE:")[1].strip())
                    c = Candidate.from_dict(data)
                    self.candidates[c.candidate_id] = c
                elif line.startswith("VOTER:"):
                    data = ast.literal_eval(line.split("VOTER:")[1].strip())
                    v = Voter.from_dict(data)
                    self.voters[v.voter_id] = v
                # (Optional) Load logs or voting_history later

    def add_candidate(self, candidate_id, name, position):
        if candidate_id not in self.candidates:
            c = Candidate(candidate_id, name, position)
            self.candidates[candidate_id] = c
            self.log_to_file(f"[{datetime.now()}] Candidate added: {candidate_id}, {name}, {position}")
            self.save_object("CANDIDATE", c.to_dict())

    def add_voter(self, voter_id, name):
        if voter_id not in self.voters:
            v = Voter(voter_id, name)
            self.voters[voter_id] = v
            self.log_to_file(f"[{datetime.now()}] Voter added: {voter_id}, {name}")
            self.save_object("VOTER", v.to_dict())

    def cast_vote(self, voter_id, candidate_id):
        if voter_id in self.voters and candidate_id in self.candidates:
            cand = self.candidates[candidate_id]
            vot = self.voters[voter_id]
            position = cand.position
            if position not in vot.voted_positions:
                cand.voters.add(voter_id)
                cand.vote_count += 1
                vot.voted_positions.add(position)
                self.log_to_file(f"[{datetime.now()}] Vote cast: Voter {voter_id} voted for {candidate_id} ({cand.name})")
                # Overwrite the updated data
                self.save_object("CANDIDATE", cand.to_dict())
                self.save_object("VOTER", vot.to_dict())
            else:
                self.log_to_file(f"[{datetime.now()}] Duplicate vote blocked for voter {voter_id} on position {position}")
        else:
            self.log_to_file(f"[{datetime.now()}] Invalid vote attempt: Voter {voter_id} or Candidate {candidate_id}")

    def show_results(self):
        self.log_to_file("\n--- Final Election Results ---")
        for position in set(c.position for c in self.candidates.values()):
            self.log_to_file(f"Position: {position}")
            for cand in self.candidates.values():
                if cand.position == position:
                    self.log_to_file(f"  {cand.name} ({cand.candidate_id}) - Votes: {cand.vote_count}")

if __name__ == "__main__":
    voting_system = VotingSystem()

    print("Existing data loaded from data.txt!")

    # Step 1: Add Candidates
    print("\nStep 1: Add Candidates (type 'done' to finish):")
    while True:
        cid = input("Candidate ID: ")
        if cid.lower() == "done":
            break
        name = input("Candidate Name: ")
        position = input("Candidate Position: ")
        voting_system.add_candidate(cid, name, position)

    # Step 2: Add Voters
    print("\nStep 2: Add Voters (type 'done' to finish):")
    while True:
        vid = input("Voter ID: ")
        if vid.lower() == "done":
            break
        name = input("Voter Name: ")
        voting_system.add_voter(vid, name)

    # Step 3: Cast Votes
    print("\nStep 3: Cast Votes (type 'done' to finish):")
    while True:
        vid = input("Voter ID: ")
        if vid.lower() == "done":
            break
        cid = input("Candidate ID to vote for: ")
        voting_system.cast_vote(vid, cid)

    # Step 4: Show and Save Results
    print("\nSaving Final Results...")
    voting_system.show_results()

    print("\n--- All content from data.txt ---\n")
    with open("data.txt", "r") as f:
        print(f.read()) 
