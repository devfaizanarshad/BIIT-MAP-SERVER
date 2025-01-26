import BranchModel from "../models/branchModel.js";

class BranchController {
    // Create a new branch
    static async createBranch(req, res) {
      try {
        const { name, address, phone} = req.body;
  
        const branch = await BranchModel.createBranch(name, address, phone);
        // Mock branch creation response
  
        return res.status(201).json({ message: "Branch created successfully", branch });
      } catch (error) {
        return res.status(500).json({ message: "Error creating branch", error: error.message });
      }
    }
  
    // Get all branches
    static async getAllBranches(req, res) {
      try {
        // Mock list of branches
        const branches = await BranchModel.getAllBranches();

        console.log("In Controller" + branches);
        
        return res.status(200).json({ branches });
      } catch (error) {
        return res.status(500).json({ message: "Error fetching branches", error: error.message });
      }
    }
  
    // Get branch by ID
    static async getBranchById(req, res) {
      try {
        const { branchId } = req.params;

        const branch =  BranchModel.getBranchById(branchId);
  
        if (!branch) {
          return res.status(404).json({ message: "Branch not found" });
        }
  
        return res.status(200).json({ branch });
      } catch (error) {
        return res.status(500).json({ message: "Error fetching branch", error: error.message });
      }
    }
  
   // Update a branch
static async updateBranch(req, res) {
  try {
    const { branchId } = req.params;
    const { name, address, phone } = req.body;

    // Perform the update
    const updatedBranch = await BranchModel.updateBranch(branchId, name, address, phone);

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Return the updated branch details
    return res.status(200).json({ message: "Branch updated successfully", branch: updatedBranch });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: "Error updating branch", error: error.message });
  }
}

    // Deactivate (soft delete) an employee
    static async deactivateBranch(req, res) {
        try {
          const { branchId } = req.params;

          const branch = await BranchModel.deleteBranch(branchId);
          // Mock success response
          return res.status(200).json({
            message: `Branch ${branchId} deactivated successfully`,
          });
        } catch (error) {
          return res.status(500).json({ message: 'Error deactivating Branch' });
        }
      }
  }
  
  export default BranchController;
  