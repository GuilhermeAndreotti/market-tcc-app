import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import { Admin } from "../model/admin.model";
import { AdminService } from "../services/admin.service";

interface IAdminContext {
  loadingAdmin: boolean;
  admins: Admin[];
  admin: Admin;
  getAdmins: () => Promise<void>;
  saveAdmin: (adminBody: Admin) => Promise<any>;
  login: (email: string, pass: string) => Promise<Admin>;
  getMLBToken: (code: string) => Promise<any>;
  loadingToken: boolean;
  getAdminById: (adminId: string) => Promise<void>;
  checkToken: () => Promise<any>;
  connected: boolean;
  removeConnection: () => Promise<any>;
  setNewPassword: (pass: string) => Promise<void>;
  editAdmin: (adminBody: Partial<Admin>) => Promise<void>;
  deleteAdmin: (adminId: string) => Promise<void>;
}

const AdminContext = createContext<IAdminContext>(Object.assign({}));

const AdminProvider = ({ children }: any) => {
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [connected, setConnected] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [admin, setAdmin] = useState<Admin>(Object.assign({}));
  const adminService = useMemo(() => new AdminService(), []);

  useEffect(() => {
    if (JSON.stringify(admin) === "{}") {
      const adminId = localStorage.getItem("adminId");
      if (adminId) {
        getAdminById(adminId);
      }
    }
  }, []);

  const login = useCallback(
    async (email: string, pass: string) => {
      try {
        setLoadingAdmin(true);
        const response = await adminService.login(email, pass);
        setAdmin(response.data);
        return response.data;
      } catch (error) {
        toast.warn("Login ou senha não confere...​");
      } finally {
        setLoadingAdmin(false);
      }
    },
    [admin, loadingAdmin]
  );

  const setNewPassword = useCallback(
    async (pass: string) => {
      try {
        setLoadingAdmin(true);
        const response = await adminService.setPassword(admin.adminId, pass);
        return response.data;
      } catch (error) {
        toast.error("Erro ao definir senha.");
      } finally {
        setLoadingAdmin(false);
      }
    },
    [admin, loadingAdmin]
  );

  const getAdminById = useCallback(
    async (adminId: string) => {
      try {
        setLoadingAdmin(true);
        const response = await adminService.getById(adminId);
        setAdmin(response.data);
      } catch (error) {
        console.log("Não existe um admin com esse id.");
      } finally {
        setLoadingAdmin(false);
      }
    },
    [admin, loadingAdmin]
  );

  const getAdmins = useCallback(async () => {
    try {
      setLoadingAdmin(true);

      const response = await adminService.get();
      setAdmins(response.data ?? []);
    } catch (error) {
      alert("Houve um erro ao recuperar os admins");
    } finally {
      setLoadingAdmin(false);
    }
  }, [admins, loadingAdmin]);

  const saveAdmin = useCallback(async (adminBody: Admin) => {
    setLoadingAdmin(true);

    await adminService
      .createAdmin(adminBody)
      .then(() => {
        toast.success("Admin cadastrado com sucesso!");
      })
      .catch(() => {
        toast.error("Houve um erro ao cadastrar o admin!");
      })
      .finally(() => setLoadingAdmin(false));
  }, []);

  const editAdmin = useCallback(async (adminBody: Partial<Admin>) => {
    setLoadingAdmin(true);

    await adminService
      .updateAdmin(adminBody)
      .then(() => {
        toast.success("Admin editado com sucesso!");
      })
      .catch(() => {
        toast.error("Houve um erro ao editar o admin!");
      })
      .finally(() => setLoadingAdmin(false));
  }, []);

  const deleteAdmin = useCallback(async (adminId: string) => {
    setLoadingAdmin(true);

    await adminService
      .deleteAdmin(adminId)
      .then(() => {
        toast.success("Admin deletado com sucesso!");
      })
      .catch(() => {
        toast.error("Houve um erro ao deletar o admin!");
      })
      .finally(() => setLoadingAdmin(false));
  }, []);

  const getMLBToken = useCallback(async (code: string) => {
    try {
      setLoadingToken(true);

      const response = await adminService.getToken(code);
      toast.success("Conexão realizada com sucesso!");
    } catch (error) {
      toast.error(
        "Houve um problema ao tentar realizar a autenticação. Tente novamente."
      );
    } finally {
      setLoadingToken(false);
    }
  }, []);

  const checkToken = useCallback(async () => {
    try {
      setLoadingToken(true);
      const response = await adminService.checkToken();
      setConnected(response.data.response);
      return response.data.response;
    } catch (error) {
      toast.error("Houve um erro ao verificar o token");
    } finally {
      setLoadingToken(false);
    }
  }, []);

  const removeConnection = useCallback(async () => {
    try {
      setLoadingToken(true);
      const response = await adminService.remove();
      return response.data.response;
    } catch (error) {
      toast.error("Houve um erro ao verificar o token");
    } finally {
      setLoadingToken(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      loadingAdmin,
      admins,
      admin,
      getAdmins,
      login,
      saveAdmin,
      getMLBToken,
      loadingToken,
      getAdminById,
      checkToken,
      connected,
      removeConnection,
      setNewPassword,
      editAdmin,
      deleteAdmin
    }),
    [
      loadingAdmin,
      loadingToken,
      admins,
      admin,
      getAdmins,
      login,
      saveAdmin,
      getMLBToken,
      checkToken,
      connected,
      removeConnection,
      setNewPassword,
      editAdmin,
      deleteAdmin
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

const useAdmin = () => {
  return useContext(AdminContext);
};

export { AdminProvider, useAdmin };
