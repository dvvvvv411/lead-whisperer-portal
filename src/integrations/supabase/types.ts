export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      affiliate_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_invitations: {
        Row: {
          affiliate_code: string
          bonus_paid_at: string | null
          bonus_paid_to_invited: boolean
          bonus_paid_to_inviter: boolean
          id: string
          invited_at: string
          invited_user_id: string
          inviter_id: string
        }
        Insert: {
          affiliate_code: string
          bonus_paid_at?: string | null
          bonus_paid_to_invited?: boolean
          bonus_paid_to_inviter?: boolean
          id?: string
          invited_at?: string
          invited_user_id: string
          inviter_id: string
        }
        Update: {
          affiliate_code?: string
          bonus_paid_at?: string | null
          bonus_paid_to_invited?: boolean
          bonus_paid_to_inviter?: boolean
          id?: string
          invited_at?: string
          invited_user_id?: string
          inviter_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          lead_id: string
          user_email: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lead_id: string
          user_email: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lead_id?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_assets: {
        Row: {
          current_price: number
          id: string
          image_url: string | null
          last_updated: string | null
          market_cap: number | null
          name: string
          price_change_24h: number | null
          price_change_percentage_24h: number | null
          symbol: string
        }
        Insert: {
          current_price?: number
          id?: string
          image_url?: string | null
          last_updated?: string | null
          market_cap?: number | null
          name: string
          price_change_24h?: number | null
          price_change_percentage_24h?: number | null
          symbol: string
        }
        Update: {
          current_price?: number
          id?: string
          image_url?: string | null
          last_updated?: string | null
          market_cap?: number | null
          name?: string
          price_change_24h?: number | null
          price_change_percentage_24h?: number | null
          symbol?: string
        }
        Relationships: []
      }
      crypto_wallets: {
        Row: {
          created_at: string
          currency: string
          id: string
          updated_at: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          currency: string
          id?: string
          updated_at?: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          affiliate_code: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          invitation_code: string | null
          message: string | null
          name: string
          phone: string | null
          source_url: string | null
          status: string
        }
        Insert: {
          affiliate_code?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          invitation_code?: string | null
          message?: string | null
          name: string
          phone?: string | null
          source_url?: string | null
          status?: string
        }
        Update: {
          affiliate_code?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          invitation_code?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          source_url?: string | null
          status?: string
        }
        Relationships: []
      }
      legal_info: {
        Row: {
          ceo_1: string
          ceo_2: string
          city: string
          company_name: string
          email: string
          favicon_url: string | null
          id: string
          logo_url: string | null
          phone_number: string
          postal_code: string
          press_links: Json | null
          site_description: string
          site_name: string
          street: string
          updated_at: string | null
          vat_id: string
        }
        Insert: {
          ceo_1?: string
          ceo_2?: string
          city?: string
          company_name?: string
          email?: string
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          phone_number?: string
          postal_code?: string
          press_links?: Json | null
          site_description?: string
          site_name?: string
          street?: string
          updated_at?: string | null
          vat_id?: string
        }
        Update: {
          ceo_1?: string
          ceo_2?: string
          city?: string
          company_name?: string
          email?: string
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          phone_number?: string
          postal_code?: string
          press_links?: Json | null
          site_description?: string
          site_name?: string
          street?: string
          updated_at?: string | null
          vat_id?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          entry_id: string
          entry_type: string
          error_message: string | null
          id: string
          notified_at: string
          success: boolean
        }
        Insert: {
          entry_id: string
          entry_type: string
          error_message?: string | null
          id?: string
          notified_at?: string
          success?: boolean
        }
        Update: {
          entry_id?: string
          entry_type?: string
          error_message?: string | null
          id?: string
          notified_at?: string
          success?: boolean
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          notes: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_email: string
          user_id: string
          wallet_currency: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_email: string
          user_id: string
          wallet_currency: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_email?: string
          user_id?: string
          wallet_currency?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "crypto_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      public_trades: {
        Row: {
          change_percentage: number | null
          created_at: string
          crypto_asset_id: string
          id: string
          is_profit: boolean | null
          price: number
          quantity: number
          total_amount: number
          type: string
          updated_at: string
        }
        Insert: {
          change_percentage?: number | null
          created_at?: string
          crypto_asset_id: string
          id?: string
          is_profit?: boolean | null
          price: number
          quantity: number
          total_amount: number
          type: string
          updated_at?: string
        }
        Update: {
          change_percentage?: number | null
          created_at?: string
          crypto_asset_id?: string
          id?: string
          is_profit?: boolean | null
          price?: number
          quantity?: number
          total_amount?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_trades_crypto_asset_id_fkey"
            columns: ["crypto_asset_id"]
            isOneToOne: false
            referencedRelation: "crypto_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_chat_ids: {
        Row: {
          chat_id: string
          created_at: string
          description: string | null
          id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          description?: string | null
          id?: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      total_payouts: {
        Row: {
          created_at: string
          created_by_admin: string
          fee_amount: number | null
          fee_paid: boolean
          fee_payment_currency: string | null
          fee_payment_wallet: string | null
          fee_percentage: number
          id: string
          payout_currency: string | null
          payout_wallet_address: string | null
          status: string
          unique_url_token: string
          updated_at: string
          user_balance: number
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by_admin: string
          fee_amount?: number | null
          fee_paid?: boolean
          fee_payment_currency?: string | null
          fee_payment_wallet?: string | null
          fee_percentage: number
          id?: string
          payout_currency?: string | null
          payout_wallet_address?: string | null
          status?: string
          unique_url_token: string
          updated_at?: string
          user_balance: number
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by_admin?: string
          fee_amount?: number | null
          fee_paid?: boolean
          fee_payment_currency?: string | null
          fee_payment_wallet?: string | null
          fee_percentage?: number
          id?: string
          payout_currency?: string | null
          payout_wallet_address?: string | null
          status?: string
          unique_url_token?: string
          updated_at?: string
          user_balance?: number
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_simulations: {
        Row: {
          created_at: string | null
          crypto_asset_id: string
          id: string
          price: number
          quantity: number
          simulation_date: string | null
          status: string
          strategy: string
          total_amount: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          crypto_asset_id: string
          id?: string
          price: number
          quantity: number
          simulation_date?: string | null
          status?: string
          strategy: string
          total_amount: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          crypto_asset_id?: string
          id?: string
          price?: number
          quantity?: number
          simulation_date?: string | null
          status?: string
          strategy?: string
          total_amount?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_simulations_crypto_asset_id_fkey"
            columns: ["crypto_asset_id"]
            isOneToOne: false
            referencedRelation: "crypto_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          amount: number
          id: string
          last_updated: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          id?: string
          last_updated?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_portfolios: {
        Row: {
          average_buy_price: number
          created_at: string | null
          crypto_asset_id: string
          id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_buy_price?: number
          created_at?: string | null
          crypto_asset_id: string
          id?: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_buy_price?: number
          created_at?: string | null
          crypto_asset_id?: string
          id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolios_crypto_asset_id_fkey"
            columns: ["crypto_asset_id"]
            isOneToOne: false
            referencedRelation: "crypto_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_email: string
          user_id: string
          wallet_address: string
          wallet_currency: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_email: string
          user_id: string
          wallet_address: string
          wallet_currency: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_email?: string
          user_id?: string
          wallet_address?: string
          wallet_currency?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      confirm_total_payout_fee: {
        Args: { payout_id: string }
        Returns: Json
      }
      create_affiliate_code_for_user: {
        Args: { user_id_param: string }
        Returns: string
      }
      create_total_payout_request: {
        Args: {
          target_user_id: string
          target_user_email: string
          fee_percentage_param: number
          admin_user_id: string
        }
        Returns: Json
      }
      generate_affiliate_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_payout_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_affiliate_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          inviter_email: string
          inviter_id: string
          affiliate_code: string
          total_invitations: number
          total_bonuses_paid: number
          total_bonus_amount: number
        }[]
      }
      get_all_payments: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          user_email: string
          amount: number
          currency: string
          wallet_currency: string
          status: string
          transaction_id: string
          notes: string
          created_at: string
          updated_at: string
        }[]
      }
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
          last_sign_in_at: string
          role: string
          activated: boolean
        }[]
      }
      get_all_withdrawals: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          user_email: string
          amount: number
          currency: string
          wallet_currency: string
          wallet_address: string
          status: string
          notes: string
          created_at: string
          updated_at: string
        }[]
      }
      get_recent_entries: {
        Args: { minutes_ago: number }
        Returns: {
          entry_type: string
          entry_id: string
          created_at: string
          name: string
          email: string
          phone: string
          user_id: string
          amount: number
          currency: string
          status: string
        }[]
      }
      get_user_activation_info: {
        Args: { user_id_param: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      initialize_user_credit: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      is_leads_only_user: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      pay_affiliate_bonus_to_inviter: {
        Args: { invited_user_id_param: string }
        Returns: Json
      }
      process_affiliate_invitation: {
        Args: { invited_user_id_param: string; affiliate_code_param: string }
        Returns: Json
      }
      process_withdrawal_status: {
        Args: {
          withdrawal_id: string
          new_status: string
          withdrawal_notes: string
          is_approved: boolean
        }
        Returns: Json
      }
      remove_user_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: undefined
      }
      sync_public_trades: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_crypto_prices: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_total_payout_status: {
        Args: {
          payout_id: string
          fee_payment_currency_param: string
          fee_payment_wallet_param: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user" | "leads_only"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "leads_only"],
    },
  },
} as const
